namespace DotNetGateway.SignatureParser.Svc2021.External;

public static class StringExtensions
{
    public static bool Between(this string s, string inclusiveLowerBound, string inclusiveUpperBound)
    {
        return
            string.CompareOrdinal(s, inclusiveLowerBound) >= 0 &&
            string.CompareOrdinal(s, inclusiveUpperBound) <= 0;
    }
}