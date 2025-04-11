using System.Globalization;
using System.IO.Compression;
using System.Reflection;
using SigStat.Common;
using SigStat.Common.Helpers;
using SigStat.Common.Loaders;

namespace DotNetGateway.SignatureParser.Svc2021.External;

/// <summary>
/// Loads SVC2021-format database from .zip
/// </summary>
public class Svc2021Loader : DataSetLoader
{
    private static readonly IFormatProvider NumberFormat = new CultureInfo("EN-US").NumberFormat;

    /// <summary>
    /// Sampling Frequency of the SVC database
    /// </summary>
    public override int SamplingFrequency => 100;

    /// <summary>
    /// Gets or sets the database as a base 64 encoded string.
    /// </summary>
    private string DataBaseZipBase64 { get; }

    /// <summary>
    /// Gets or sets a value indicating whether features are also loaded as <see cref="Features"/>
    /// </summary>
    private bool StandardFeatures { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="Svc2021Loader"/> class with specified database.
    /// </summary>
    /// <param name="dataBaseZipBase64">Represents the path, to load the signatures from. It supports two basic approaches:
    /// <list type="bullet">
    /// <item>DatabasePath may point to a (non password protected) zip file, containing the signature files</item>
    /// <item>DatabasePath may point to a directory with all the signer files or with files grouped in subdirectories</item>
    /// </list></param>
    /// <param name="standardFeatures">Convert loaded data (<see cref="Svc2021Features"/>) to standard <see cref="Features"/>.</param>
    public Svc2021Loader(string dataBaseZipBase64, bool standardFeatures)
    {
        DataBaseZipBase64 = dataBaseZipBase64;
        StandardFeatures = standardFeatures;
    }

    /// <inheritdoc/>
    public override IEnumerable<Signer> EnumerateSigners(Predicate<Signer> signerFilter)
    {
        this.LogInformation("Enumerating signers started.");
        var zipFileBytes = Convert.FromBase64String(DataBaseZipBase64);
        using var memoryStream = new MemoryStream(zipFileBytes);
        var zip = new ZipArchive(memoryStream, ZipArchiveMode.Read);

        var signatureGroups = zip.Entries
            .Where(f => f.FullName.StartsWith("DeepSignDB") && f.Name.EndsWith(".txt"))
            .Select(f => new SignatureFile(f.FullName))
            .GroupBy(sf => sf.SignerId)
            .ToList();

        using var progress = ProgressHelper.StartNew(signatureGroups.Count, 10);
        foreach (var group in signatureGroups)
        {
            var signer = new Signer { ID = group.Key };

            if (signerFilter != null && !signerFilter(signer))
            {
                continue;
            }

            foreach (var signatureFile in group)
            {
                var signature = new Svc2021Signature
                {
                    Signer = signer,
                    ID = signatureFile.SignatureId,
                    Db = signatureFile.Db,
                    Split = signatureFile.Split,
                    FileName = signatureFile.FileName,
                    InputDevice = signatureFile.InputDevice,
                    Origin = signatureFile.Origin
                };

                using (var fileStream = zip.GetEntry(signatureFile.FileName)!.Open())
                {
                    LoadSignature(signature, fileStream, StandardFeatures);
                }

                signer.Signatures.Add(signature);
            }

            signer.Signatures = signer.Signatures.OrderBy(s => s.ID).ToList();

            progress.Value++;
            yield return signer;
        }
    }


    /// <summary>
    /// Loads one signature from specified stream.
    /// </summary>
    /// <param name="signature">Signature to write features to.</param>
    /// <param name="fileStream">Stream to read svc2021 data from.</param>
    /// <param name="standardFeatures">Convert loaded data to standard <see cref="Features"/>.</param>
    private static void LoadSignature(Signature signature, Stream fileStream, bool standardFeatures)
    {
        using var sr = new StreamReader(fileStream);
        ParseSignature(signature, sr.ReadToEnd().Split(["\r\n", "\r", "\n"], StringSplitOptions.None),
            standardFeatures);
    }

    private struct Line(Line line)
    {
        public int X = line.X;
        public int Y = line.Y;
        public long T = line.T;
        public double Pressure = line.Pressure;
    }

    private static void ParseSignature(Signature sig, string[] linesArray, bool standardFeatures)
    {
        var signature = (Svc2021Signature)sig;

        // Set pressure column based on database
        var pressureColumn = signature.Db switch
        {
            Db.Mcyt => 5,
            Db.BioSecureId => 6,
            Db.BioSecureDs2 => 6,
            Db.EBioSignDs1 => 3,
            Db.EBioSignDs2 => 3,
            Db.EvalDb => 3,
            _ => throw new NotSupportedException($"Unsupported DB: {signature.Db}")
        };

        List<Line> lines;
        try
        {
            lines = linesArray
                .Skip(1)
                .Where(l => l != "")
                .Select(l => ParseLine(l, pressureColumn, signature.InputDevice))
                .ToList();
        }
        catch (Exception exc)
        {
            throw new Exception("Error parsing signature: " + sig.ID, exc);
        }

        // Sometimes timestamps are missing. In these cases we fill them in with uniform data. E.g: Evaluation\\stylus\\u0114_s_u1015s0001_sg0004.txt
        if (lines.All(l => l.T == 0))
        {
            for (var i = 0; i < lines.Count; i++)
            {
                lines[i] = new Line(lines[i]) { T = i * 10 };
            }
        }

        // HACK: same timestamp for measurements do not make sense
        // therefore, we remove the second entry
        // a better solution would be to change the timestamps based on their environments
        for (var i = 0; i < lines.Count - 1; i++)
        {
            if (lines[i].T != lines[i + 1].T)
                continue;
            lines.RemoveAt(i + 1);
            i--;
        }

        // We need to manually calculate the input type for the Eval DB
        if (signature.InputDevice == InputDevice.Unknown)
        {
            signature.InputDevice = lines.TrueForAll(l => l.Pressure == 0) ? InputDevice.Finger : InputDevice.Stylus;
        }

        if (signature.InputDevice == InputDevice.Stylus)
        {
            // Remove noise (points with 0 pressure) from the beginning of the signature
            while (lines.Count > 0 && lines[0].Pressure == 0)
            {
                lines.RemoveAt(0);
            }

            // Remove noise (points with 0 pressure) from the end of the signature
            while (lines.Count > 0 && lines[^1].Pressure == 0)
            {
                lines.RemoveAt(lines.Count - 1);
            }
        }

        if (lines.Count == 0)
            throw new Exception("No lines were loaded for signature: " + signature.ID);


        // Task1, Task2
        signature.SetFeature(Svc2021Features.X, lines.Select(l => l.X).ToList());
        signature.SetFeature(Svc2021Features.Y, lines.Select(l => l.Y).ToList());
        signature.SetFeature(Svc2021Features.T, lines.Select(l => l.T).ToList());
        signature.SetFeature(Svc2021Features.Pressure, lines.Select(l => l.Pressure).ToList());


        // signature.SetFeature(Svc2021.Button, lines.Select(l => l[3]).ToList());

        // There are some anomalies in the database which have to be eliminated by standard features
        var standardLines = lines.ToList();
        if (!standardFeatures)
            return;

        // There are no upstrokes in the database, the starting points of down strokes are marked by button=0 values 
        // There are some anomalies in the database: button values between 2-5 and some upstrokes were not deleted
        // Button is 2 or 4 if the given point's pressure is 0
        // Button is 1, 3, 5 if the given point is in a down stroke
        // var button = signature.GetFeature(Svc2021.Button).ToArray();
        // var pointType = new double[button.Length];
        // for (int i = 0; i < button.Length; i++)
        // {
        //     if (button[i] == 0)
        //         pointType[i] = 1;
        //     else if (i == button.Length - 1 || (button[i] % 2 == 1 && button[i + 1] % 2 == 0))
        //         pointType[i] = 2;
        //     else if (button[i] == 2 || button[i] == 4)
        //         pointType[i] = 0;
        //     else if (button[i] % 2 == 1 && button[i - 1] % 2 == 0 && button[i - 1] != 0)
        //         pointType[i] = 1;
        //     else
        //         pointType[i] = 0;
        // }


        // Because of the anomalies we have to remove some zero pressure points
        // standardLines.Reverse();
        // var standardPointType = pointType.ToList();
        // standardPointType.Reverse();
        // for (int i = standardLines.Count - 1; i >= 0; i--)
        // {
        //     if (standardLines[i][3] == 2 || standardLines[i][3] == 4)
        //     {
        //         standardLines.RemoveAt(i);
        //         standardPointType.RemoveAt(i); // we have to remove generated point type values of zero pressure points as well
        //     }
        // }
        // standardLines.Reverse();
        // standardPointType.Reverse();

        signature.SetFeature(Features.X, standardLines.Select(l => (double)l.X).ToList());
        signature.SetFeature(Features.Y, standardLines.Select(l => (double)l.Y).ToList());
        signature.SetFeature(Features.T, standardLines.Select(l => (double)l.T).ToList());
        signature.SetFeature(Features.Pressure, standardLines.Select(l => l.Pressure).ToList());

        // signature.SetFeature(Features.PenDown, standardLines.Select(l => l[3] != 0).ToList());
        // signature.SetFeature(Features.PointType, standardPointType);

        // SignatureHelper.CalculateStandardStatistics(signature);
    }

    private static Line ParseLine(string lineString, int pressureColumn, InputDevice inputDevice)
    {
        var parts = lineString.Split(' ');
        return new Line()
        {
            X = int.Parse(parts[0]),
            Y = int.Parse(parts[1]),
            T = long.Parse(parts[2]),
            // Finger datasets do not contain meaningful pressure information
            Pressure = double.Parse(parts[pressureColumn], NumberFormat)
            // inputDevice == InputDevice.Finger ? 1 : double.Parse(parts[pressureColumn], numberFormat)
        };
    }

    private struct SignatureFile
    {
        public string FileName { get; }
        public string SignerId { get; }
        public string SignatureId { get; }
        public Db Db { get; }
        public Split Split { get; }
        public InputDevice InputDevice { get; }
        public Origin Origin { get; }

        public SignatureFile(string fileName)
        {
            FileName = fileName;
            var pathParts = fileName.Contains('/') ? fileName.Split('/') : fileName.Split('\\');

            if (fileName.Contains("signature"))
            {
                SignatureId = string.Join('\\', pathParts[^1]);
                SignerId = string.Join('\\', pathParts[^1]);
                Db = Db.EvalDb;
                Split = Split.Evaluation;
                Origin = Origin.Unknown;
                InputDevice = InputDevice.Unknown;
                return;
            }

            Split = Enum.Parse<Split>(pathParts[^3], true);
            InputDevice = Enum.Parse<InputDevice>(pathParts[^2], true);

            var parts = pathParts[^1].Split("_");
            Origin = parts[1] switch
            {
                "g" => Origin.Genuine,
                "s" => Origin.Forged,
                _ => throw new NotSupportedException($"Unsupported origin: {parts[1]}")
            };

            SignerId = parts[0].Replace("u", "");
            SignatureId = string.Join('\\', pathParts[^3..]);

            Db = GetDatabase(Split, InputDevice, SignerId, fileName);
        }

        private static Db GetDatabase(Split split, InputDevice inputDevice, string signerId, string file)
        {
            switch (split)
            {
                case Split.Development:
                    switch (inputDevice)
                    {
                        case InputDevice.Finger:
                            if (signerId.Between("1009", "1038")) return Db.EBioSignDs1;
                            if (signerId.Between("1039", "1084")) return Db.EBioSignDs2;
                            throw new NotSupportedException($"Undefined DB for file: {file}");
                        case InputDevice.Stylus:
                            if (signerId.Between("0001", "0230")) return Db.Mcyt;
                            if (signerId.Between("0231", "0498")) return Db.BioSecureId;
                            if (signerId.Between("1009", "1038")) return Db.EBioSignDs1;
                            if (signerId.Between("1039", "1084")) return Db.EBioSignDs2;
                            throw new NotSupportedException($"Undefined DB for file: {file}");
                        case InputDevice.Unknown:
                        default:
                            throw new NotSupportedException($"Undefined InputDevice for file: {file}");
                    }
                case Split.Evaluation:
                    switch (inputDevice)
                    {
                        case InputDevice.Finger:
                            if (signerId.Between("0373", "0407")) return Db.EBioSignDs1;
                            if (signerId.Between("0408", "0442")) return Db.EBioSignDs2;
                            throw new NotSupportedException($"Undefined DB for file: {file}");
                        case InputDevice.Stylus:
                            if (signerId.Between("0001", "0100")) return Db.Mcyt;
                            if (signerId.Between("0101", "0232")) return Db.BioSecureId;
                            if (signerId.Between("0233", "0372")) return Db.BioSecureDs2;
                            if (signerId.Between("0373", "0407")) return Db.EBioSignDs1;
                            if (signerId.Between("0408", "0442")) return Db.EBioSignDs2;
                            throw new NotSupportedException($"Undefined DB for file: {file}");
                        case InputDevice.Unknown:
                        default:
                            throw new NotSupportedException($"Undefined InputDevice for file: {file}");
                    }
                default:
                    throw new NotSupportedException($"Undefined Split for file: {file}");
            }
        }
    }
}

public enum Db
{
    Mcyt,
    EBioSignDs1,
    EBioSignDs2,
    BioSecureId,
    BioSecureDs2,
    EvalDb
}

public enum InputDevice
{
    Unknown,
    Finger,
    Stylus
}

[Flags]
public enum Split
{
    Development = 1,
    Evaluation = 2
}

/// <summary>
/// Set of features containing raw data loaded from SVC2021 database.
/// </summary>
public static class Svc2021Features
{
    public static readonly FeatureDescriptor<string> FileName =
        FeatureDescriptor.Get<string>("Svc2021.FileName");

    public static readonly FeatureDescriptor<Db> Db =
        FeatureDescriptor.Get<Db>("Svc2021.DB");

    public static readonly FeatureDescriptor<Split> Split =
        FeatureDescriptor.Get<Split>("Svc2021.Split");

    public static readonly FeatureDescriptor<InputDevice> InputDevice =
        FeatureDescriptor.Get<InputDevice>("Svc2021.InputDevice");

    public static readonly FeatureDescriptor<bool> IsPreprocessed =
        FeatureDescriptor.Get<bool>("Svc2021.IsPreprocessed");

    /// <summary>
    /// X coordinates from the online signature imported from the SVC2021 database
    /// </summary>
    public static readonly FeatureDescriptor<List<int>> X =
        FeatureDescriptor.Get<List<int>>("Svc2021.X");

    /// <summary>
    /// Y coordinates from the online signature imported from the SVC2021 database
    /// </summary>
    public static readonly FeatureDescriptor<List<int>> Y =
        FeatureDescriptor.Get<List<int>>("Svc2021.Y");

    /// <summary>
    /// T values from the online signature imported from the SVC2021 database
    /// </summary>
    public static readonly FeatureDescriptor<List<long>> T =
        FeatureDescriptor.Get<List<long>>("Svc2021.T");

    /// <summary>
    /// Pressure values from the online signature imported from the SVC2021 database
    /// </summary>
    public static readonly FeatureDescriptor<List<double>> Pressure =
        FeatureDescriptor.Get<List<double>>("Svc2021.Pressure");

    /// <summary>
    /// A list of all Svc2004 feature descriptors
    /// </summary>
    public static readonly FeatureDescriptor?[] All =
        typeof(Svc2021Features)
            .GetFields(BindingFlags.Static | BindingFlags.Public)
            .Where(f => f.FieldType.IsGenericType &&
                        f.FieldType.GetGenericTypeDefinition() == typeof(FeatureDescriptor<>))
            .Select(f => (FeatureDescriptor?)f.GetValue(null))
            .ToArray();
}