using Ceilingfish.MilkRound.Mobile.Core.Services;
using Ceilingfish.MilkRound.Mobile.Core.ViewModels;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Ceilingfish.MilkRound.Mobile.Core
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Login : ContentPage
    {
        private readonly IAccountProvider accountProvider;

        public Login()
        {
            this.accountProvider = DependencyService.Resolve<IAccountProvider>();
            InitializeComponent();
            var loginState = new LoginViewModel();
        }
    }
}