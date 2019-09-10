using Ceilingfish.MilkRound.Mobile.Core.ViewModels;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Ceilingfish.MilkRound.Mobile.Core
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Login : ContentPage
    {
        public Login()
        {
            InitializeComponent();
            BindingContext = new LoginViewModel();
        }
    }
}