using SigStat.Common;

namespace DotNetGateway.SignatureParser.Svc2021.External
{
    /// <summary>
    /// Strongly typed wrapper for representing SVC2021 Signatures
    /// </summary>
    public class Svc2021Signature : Signature
    {
        public string FileName { get => GetFeature(Svc2021Features.FileName); set => SetFeature(Svc2021Features.FileName, value); }
        public Db Db { get => GetFeature(Svc2021Features.Db); set => SetFeature(Svc2021Features.Db, value); }
        public Split Split { get => GetFeature(Svc2021Features.Split); set => SetFeature(Svc2021Features.Split, value); }
        public InputDevice InputDevice { get => GetFeature(Svc2021Features.InputDevice); set => SetFeature(Svc2021Features.InputDevice, value); }

        public List<double> X { get => GetFeature(Features.X); set => SetFeature(Features.X, value); }
        public List<double> Y { get => GetFeature(Features.Y); set => SetFeature(Features.Y, value); }
        public List<double> Pressure { get => GetFeature(Features.Pressure); set => SetFeature(Features.Pressure, value); }
        public List<double> T { get => GetFeature(Features.T); set => SetFeature(Features.T, value); }

        public List<int> SvcX { get => GetFeature(Svc2021Features.X); set => SetFeature(Svc2021Features.X, value); }
        public List<int> SvcY { get => GetFeature(Svc2021Features.Y); set => SetFeature(Svc2021Features.Y, value); }
        public List<double> SvcPressure { get => GetFeature(Svc2021Features.Pressure); set => SetFeature(Svc2021Features.Pressure, value); }
        public List<long> SvcT { get => GetFeature(Svc2021Features.T); set => SetFeature(Svc2021Features.T, value); }
        
        public bool IsPreprocessed { get => GetFeature(Svc2021Features.IsPreprocessed); set => SetFeature(Svc2021Features.IsPreprocessed, value); }

        public Svc2021Signature()
        {
            IsPreprocessed = false;
        }
    }
}