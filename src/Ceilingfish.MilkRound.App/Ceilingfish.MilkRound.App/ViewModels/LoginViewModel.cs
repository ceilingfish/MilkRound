using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Ceilingfish.MilkRound.Mobile.Core.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        private string username = "me", password = nameof(password);

        public string Username
        {
            set
            {
                if (username != value)
                {
                    username = value;

                    OnPropertyChanged();
                }
            }
            get => username;
        }

        public string Password
        {
            set
            {
                if (password != value)
                {
                    password = value;

                    OnPropertyChanged();
                }
            }
            get => password;
        }

        public bool IsEnabled
        {
            get
            {
                s
            }
        }
    }
}
