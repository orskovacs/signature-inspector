using SigStat.Common;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace DotNetGateway.SignatureParser.Svc2021.External
{
    /// <summary>
    /// Strongly typed wrapper for representing SVC2021 Signatures
    /// </summary>
    public class Svc2021Signature : Signature
    {
        public string FileName { get => GetFeature(External.Svc2021.FileName); set => SetFeature(External.Svc2021.FileName, value); }
        public Db Db { get => GetFeature(External.Svc2021.Db); set => SetFeature(External.Svc2021.Db, value); }
        public Split Split { get => GetFeature(External.Svc2021.Split); set => SetFeature(External.Svc2021.Split, value); }
        public InputDevice InputDevice { get => GetFeature(External.Svc2021.InputDevice); set => SetFeature(External.Svc2021.InputDevice, value); }

        public List<double> X { get => GetFeature(Features.X); set => SetFeature(Features.X, value); }
        public List<double> Y { get => GetFeature(Features.Y); set => SetFeature(Features.Y, value); }
        public List<double> Pressure { get => GetFeature(Features.Pressure); set => SetFeature(Features.Pressure, value); }
        public List<double> T { get => GetFeature(Features.T); set => SetFeature(Features.T, value); }

        public List<int> SvcX { get => GetFeature(External.Svc2021.X); set => SetFeature(External.Svc2021.X, value); }
        public List<int> SvcY { get => GetFeature(External.Svc2021.Y); set => SetFeature(External.Svc2021.Y, value); }
        public List<double> SvcPressure { get => GetFeature(External.Svc2021.Pressure); set => SetFeature(External.Svc2021.Pressure, value); }
        public List<long> SvcT { get => GetFeature(External.Svc2021.T); set => SetFeature(External.Svc2021.T, value); }

        public Image<Rgba32> Image { get => GetFeature(Features.Image);  set => SetFeature(Features.Image, value); }

        public bool IsPreprocessed { get => GetFeature(External.Svc2021.IsPreprocessed); set => SetFeature(External.Svc2021.IsPreprocessed, value); }

        public Svc2021Signature()
        {
            IsPreprocessed = false;
        }
    }
}