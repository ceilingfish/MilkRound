using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ceilingfish.MilkRound.Api.Models
{
    public class Postcode
    {
        private static readonly Regex Expression = new Regex(@"(?<RegionCode>\w{1,2})(?<RegionNumber>\d{1,2})(?<Locality>\d\w{2})", RegexOptions.IgnoreCase);

        public string RegionCode { get; }

        public int RegionNumber { get; }

        public string Locality { get; }

        public Postcode(string postCode)
        {
            if(TryMatch(postCode, true, out var region, out var regionNumber, out var locality))
            {
                RegionCode = region;
                RegionNumber = regionNumber;
                Locality = locality;
            }
            else
            {
                throw new ArgumentException("Invalid format");
            }
        }

        private Postcode(string regionCode, int regionNumber, string locality)
        {
            RegionCode = regionCode;
            RegionNumber = regionNumber;
            Locality = locality;
        }

        public static bool TryExtract(string address, out Postcode postcode)
        {
            if (TryMatch(address, false, out var region, out var regionNumber, out var locality))
            {
                postcode = new Postcode(region, regionNumber, locality);
                return true;
            }
            else
            {
                postcode = null;
                return false;
            }
        }

        private static bool TryMatch(string value, bool matchAll, out string regionCode, out int regionNumber, out string locality)
        {
            value = value.Replace(" ", "").Replace("\t", "");

            if (value.Length < 5 || value.Length > 7)
            {
                throw new ArgumentException("Invalid length", nameof(value));
            }

            var match = Expression.Match(value);
            if (match.Success && (!matchAll || (match.Index == 0 && match.Length == value.Length)))
            {
                regionCode = match.Groups[nameof(RegionCode)].Value.ToUpper();
                regionNumber = int.Parse(match.Groups[nameof(RegionNumber)].Value);
                locality = match.Groups[nameof(Locality)].Value.ToUpper();
                return true;
            }
            else
            {
                regionCode = default;
                regionNumber = default;
                locality = default;
                return false;
            }
        }

        public override string ToString() => FormattableString.Invariant($"{RegionCode}{RegionNumber} {Locality}");

        public static implicit operator string(Postcode postcode) => postcode.ToString();
    }
}
