var viewModel = function () {
    var self = this;

    this.view = ko.observable('signIn');

    this.signIn = {
        email: ko.observable(''),
        password: ko.observable(''),
        submit: function () {
            console.log('Login attemp. Email: ' + this.signIn.email() + ', Password: ' + this.signIn.password());
        }
    };


    // Sign up
    this.signUp = {
        email: ko.observable('').extend({ email: true, required: { required: true, message: 'Please specify an email address' } }),
        password: ko.observable('').extend({ minLength: 6, maxLength: 24, required: { required: true, message: 'Please specify a password' } }),
        submit: function () {
            this.signUpsubmittedOnce(true);
            if (this.signUpValidation.isValid()){
                justGolf.setAccount(this.signUp.email(), this.signUp.password());
                sammy.setLocation('#/start');
            }
        }
    };
    this.signUpsubmittedOnce = ko.observable(false);
    this.signUpValidation = ko.validatedObservable(this.signUp);

    // Sammy
    var sammy = $.sammy('.content', function () {

        this.get('#/', function (context) {
            var localAccount = load('account');
            if (justGolf.model.account.email == localAccount.email && justGolf.model.account.password == localAccount.password)
                this.redirect('#/start');
            else
                self.view('signIn');
        });

        this.get('#/signUp', function (context) {
            self.view('signUp');
        });

        this.get('#/start', function (context) {
            self.view('start');
        });

        this.get('#/play', function (context) {
            self.view('play');
        });

        this.get('#/stats', function (context) {
            self.view('stats');
        });

        this.get('#/settings', function (context) {
            self.view('settings');
        });

        this.post('#/signIn', function (context) {
            return false;
        });

        this.post('#/signUp', function (context) {
            return false;
        });

    }).run('#/');

    ko.validation.init({
        insertMessages: false,
        decorateElement: true,
        errorElementClass: 'error'
    });
};

$(function () {
    justGolf = new JustGolf(load('justGolf'));
    var vm = new viewModel();
    ko.applyBindings(vm);
    
});

function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

function save(key, model) {
    localStorage.setItem(key, JSON.stringify(model));
}

// Client model
var justGolf;


JustGolf = function (model) {
    this.model = model ? model : {
        account: {
            email: '',
            password: ''
        }        
    }    
}

JustGolf.prototype.setAccount = function (email, password) {
    this.model.account.email = email;
    this.model.account.password = password;
    save('account', { email: email, password: password });
    save('justGolf', this.model);
}

if (typeof (localStorage) == 'undefined') {
    alert('Your browser does not support HTML5 localStorage. Try upgrading.');
}