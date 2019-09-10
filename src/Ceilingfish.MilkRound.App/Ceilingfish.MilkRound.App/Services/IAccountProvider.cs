using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Ceilingfish.MilkRound.Mobile.Core.Services
{
    public interface IAccountProvider
    {
        Task LoginAsync(string username, string password);
    }
}
