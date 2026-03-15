define(['jquery', 'underscore', 'backbone', 'widgets/utils', 'widgets/default/models/field', 'widgets/default/models/widgetconfiguration'],
    function($, _, Backbone, Utils, Field, WidgetConfiguration) {
        var Client = Backbone.Model.extend({
            url: Utils.get_server_url(),
            initialize: function(attributes) {
                this.field = new Field();

                if (typeof attributes !== 'undefined') {
                    this.ClientFields = attributes.ClientFields;
                    this.EventFields = attributes.EventFields;
                }

                this.widgetconfiguration = new WidgetConfiguration();

                this.url += "signup/";
            },
            validate: function(attrs, options) {
                this.someErrors = [];
                this.attrs = attrs;

                if (options && options.screen && options.screen === 'signin') {
                    this.checkSignInFields();
                    if (this.someErrors.length > 0) {
                        return this.someErrors;
                    }
                    return;
                }

                if (options && options.screen && options.screen === 'signedin') {
                    this.checkSignedInFields();
                    if (this.someErrors.length > 0) {
                        return this.someErrors;
                    }
                    return;
                }

                if (options && options.screen && options.screen === 'recoverpassword') {
                    this.checkRecoverPassswordFields();
                    if (this.someErrors.length > 0) {
                        return this.someErrors;
                    }
                    return;
                }

                if (options && options.screen && options.screen === 'accountlogin') {
                    this.checkAccountLoginFields();
                    if (this.someErrors.length > 0) {
                        return this.someErrors;
                    }
                    return;
                }

                if (options && options.screen && options.screen === 'changepassword') {
                    this.checkChangePasswordFields();
                    if (this.someErrors.length > 0) {
                        return this.someErrors;
                    }
                    return;
                }

                //signup
                this.checkSignUpFields();
                if (this.someErrors.length > 0) {
                    return this.someErrors;
                }

            },
            checkNotEmptyField: function(field) {
                var textCheck = [];
                textCheck['en'] = 'Please check an option';
                textCheck['pt'] = 'Selecione uma opção';
                textCheck['ca'] = 'Cal acceptar aquesta opció';
                textCheck['es'] = 'Hay que aceptar esta opción';
                textCheck['it'] = 'Please check an option';
                textCheck['du'] = 'Please check an option';
                textCheck['uk'] = 'Будь ласка, перевірте варіант';
                textCheck['de'] = 'Haken Sie bitte eine Auswahl ab';
                textCheck['ko'] = '옵션을 선택하십시오';
                textCheck['fr'] = 'Veuillez cocher une option';
                textCheck['eu'] = 'Mesedez, markatu aukera bat';

                var textSelect = [];
                textSelect['en'] = 'Please select one option';
                textSelect['pt'] = 'Selecione uma opção';
                textSelect['ca'] = 'Si us plau selecciona una opció';
                textSelect['es'] = 'Por favor selecciona una opción';
                textSelect['it'] = 'Please select one option';
                textSelect['du'] = 'Please select one option';
                textSelect['uk'] = 'Будь ласка, виберіть один з варіантів';
                textSelect['de'] = 'Wählen Sie bitte eine Auswahl aus';
                textSelect['ko'] = '옵션을 선택하십시오';
                textSelect['fr'] = 'Sélectionnez une option';
                textSelect['eu'] = 'Mesedez, hautatu aukera bat';

                var textInput = [];
                textInput['en'] = 'Please fill the';
                textInput['pt'] = 'Por favor, preencha o';
                textInput['ca'] = 'Si us plau ompli el';
                textInput['es'] = 'Por favor rellene el';
                textInput['it'] = 'Please fill the';
                textInput['du'] = 'Please fill the';
                textInput['uk'] = 'Будь ласка, заповніть';
                textInput['de'] = 'Bitte füllen Sie die';
                textInput['ko'] = '입력하십시오';
                textInput['fr'] = 'Remplissez le';
                textInput['eu'] = 'Mesedez, bete';

                var isClientFields = typeof field['validate'] !== "undefined";
                var isNotValidationField = ((!isClientFields) || (isClientFields && parseInt(field['validate']) === 0)) ? true : false;
                var isNotMandatoryField = parseInt(field['obligatory']) === 0;
                var notShowFieldOnWidget = parseInt(field['show_widget']) === 0;
                var isNotSelectedOption = !this.attrs[field['input_text']] || (this.attrs[field['input_text']] && this.attrs[field['input_text']] < 0);
                var iFieldType = parseInt(field['type']);
                var bFirstAppointment = (typeof oClientValues_248295.widgetconfiguration.registration_type !== 'undefined' && parseInt(oClientValues_248295.widgetconfiguration.registration_type) === this.widgetconfiguration.iFirstAppointment) ? true : false;

                if (notShowFieldOnWidget) return;
                if (bFirstAppointment && isNotMandatoryField) return;
                if (isNotValidationField && isNotMandatoryField) return;

                if ((iFieldType === this.field.iTypeCheckbox) && this.isAnEmptyField(field['input_text'])) {
                    this.someErrors.push({
                        message: textCheck[bkt_init_widget.lang],
                        field: field['input_text']
                    });
                } else if ((iFieldType === this.field.iTypeDrop) && isNotSelectedOption) {
                    this.someErrors.push({
                        message: textSelect[bkt_init_widget.lang],
                        field: field['input_text']
                    });
                } else if (this.isAnEmptyField(field['input_text'])) {
                    this.someErrors.push({
                        message: textInput[bkt_init_widget.lang] + ' ' + field['field_text'],
                        field: field['input_text']
                    });
                }
            },
            parse: function(response) {
                if (typeof response.status !== 'undefined' && response.status === "false") {
                    $("#idBktDefaultServicesErrorContainer").show();
                } else if (typeof response.Exception !== 'undefined') {
                    return response.Exception;
                } else {
                    return response.Client;
                }
            },
            sync: function(method, model, options) {
                options.dataType = "jsonp";
                return Backbone.sync(method, model, options);
            },
            checkSignInFields: function() {
                this.checkLoginField();
                this.checkPasswordField();

                if (typeof oClientValues_248295.waitingListData === 'undefined') {
                    for (var i = 0; i < this.EventFields.length; i++) {
                        this.checkNotEmptyField(this.EventFields[i]);
                    }
                }

                return this.someErrors;

            },
            checkSignedInFields: function() {
                if (typeof oClientValues_248295.waitingListData === 'undefined') {
                    for (var i = 0; i < this.EventFields.length; i++) {
                        this.checkNotEmptyField(this.EventFields[i]);
                    }
                }

                return this.someErrors;

            },
            checkAccountLoginFields: function() {
                this.checkLoginField();
                this.checkPasswordField();

                return this.someErrors;
            },
            checkRecoverPassswordFields: function() {
                var textEmail = [];
                textEmail['en'] = 'Please fill the email field';
                textEmail['pt'] = 'Por favor, preencha o campo de email';
                textEmail['ca'] = 'Si us plau completi el camp email';
                textEmail['es'] = 'Por favor complete el campo email';
                textEmail['it'] = 'Please fill the email field';
                textEmail['du'] = 'Please fill the email field';
                textEmail['uk'] = 'Заповніть, будь ласка, поле електронної пошти';
                textEmail['de'] = 'Füllen Sie bitte das E-Mail-Feld';
                textEmail['ko'] = '이메일을 입력하십시오';
                textEmail['fr'] = 'Remplissez le champ de messagerie';
                textEmail['eu'] = 'Mesedez, bete helbide elektronikoaren eremua';

                if (this.isAnEmptyField('email')) {
                    this.someErrors.push({
                        message: textEmail[bkt_init_widget.lang],
                        field: 'email'
                    })
                }

                return this.someErrors;
            },
            checkSignUpFields: function() {
                var textAccept = [];
                textAccept['en'] = 'Accept conditions needed';
                textAccept['pt'] = 'Você deve aceitar as condições';
                textAccept['ca'] = 'Cal acceptar les condicions';
                textAccept['es'] = 'Es necesario aceptar las condiciones';
                textAccept['it'] = 'Accept conditions needed';
                textAccept['du'] = 'Accept conditions needed';
                textAccept['uk'] = "Прийняти умови, обов'язково";
                textAccept['de'] = "Zustimmung der Nutzungsbedingungen notwendig";
                textAccept['ko'] = "필요한 조건들을 수락합니다";
                textAccept['fr'] = "Accepter les conditions requises";
                textAccept['eu'] = "Baldintzak onartu behar dituzu";

                for (var i = 0; i < this.ClientFields.length; i++) {
                    if (this.ClientFields[i]['input_text'] === 'password') {
                        this.checkPasswordField(this.ClientFields[i]);

                        if (this.attrs['password'].length < 6) {
                            this.someErrors.push({
                                message: this.getTextChangeLowChars(),
                                field: 'password'
                            });
                        }
                    } else {
                        this.checkNotEmptyField(this.ClientFields[i]);
                    }
                }

                if (typeof oClientValues_248295.waitingListData === 'undefined') {
                    for (var i = 0; i < this.EventFields.length; i++) {
                        this.checkNotEmptyField(this.EventFields[i]);
                    }
                }

                if (!this.attrs['accept_conditions'] || (this.attrs['accept_conditions'] && this.attrs['accept_conditions'].replace(' ', '').length <= 0)) {
                    this.someErrors.push({
                        message: textAccept[bkt_init_widget.lang],
                        field: 'accept_conditions'
                    });
                }

                return this.someErrors;
            },
            checkPasswordField: function() {
                var textPassword = [];
                textPassword['en'] = 'Please fill the password field';
                textPassword['pt'] = 'Por favor, preencha o campo de senha';
                textPassword['ca'] = 'Si us plau omplir el camp de contrasenya';
                textPassword['es'] = 'Por favor llenar el campo de contraseña';
                textPassword['it'] = 'Please fill the password field';
                textPassword['du'] = 'Please fill the password field';
                textPassword['uk'] = 'Заповніть, будь ласка, поле для пароля';
                textPassword['de'] = 'Füllen Sie bitte das Passwortfeld';
                textPassword['ko'] = '패스워드를 입력하십시오';
                textPassword['fr'] = 'Remplissez le champ du mot de passe';
                textPassword['eu'] = 'Mesedez, bete pasahitzaren eremua';

                if (this.isAnEmptyField('password')) {
                    this.someErrors.push({
                        message: textPassword[bkt_init_widget.lang],
                        field: 'password'
                    })
                }
            },
            checkLoginField: function() {
                var textLogin = [];
                textLogin['en'] = 'Please fill the login field';
                textLogin['pt'] = 'Por favor, preencha o campo de login';
                textLogin['ca'] = 'Si us plau completi el camp login';
                textLogin['es'] = 'Por favor complete el campo login';
                textLogin['it'] = 'Please fill the login field';
                textLogin['du'] = 'Please fill the login field';
                textLogin['uk'] = "Будь ласка, заповніть поле Ім'я користувача";
                textLogin['de'] = "Füllen Sie bitte das Login-Feld";
                textLogin['ko'] = "로그인란을 입력하십시오";
                textLogin['fr'] = "Remplissez le champ de connexion";
                textLogin['eu'] = "Mesedez, bete saioa hasteko eremua";

                if (this.isAnEmptyField('login')) {
                    this.someErrors.push({
                        message: textLogin[bkt_init_widget.lang],
                        field: 'login'
                    })
                }

                if (this.isAnEmptyField('logintype')) {
                    this.someErrors.push({
                        message: textLogin[bkt_init_widget.lang],
                        field: 'login'
                    })
                }
            },
            checkChangePasswordFields: function() {
                var textChangeEmpty = [];
                textChangeEmpty['en'] = 'Please fill the new and repeated password fields';
                textChangeEmpty['pt'] = 'Por favor, preencha o novo campo de senha e repita';
                textChangeEmpty['ca'] = 'Si us plau completi els camps nou i repetir contrasenya';
                textChangeEmpty['es'] = 'Por favor complete los campo nuevo y repetir contraseña';
                textChangeEmpty['it'] = 'Si prega di compilare il nuovo campo e ripetere la password';
                textChangeEmpty['du'] = 'Please fill the new and repeated password fields';
                textChangeEmpty['uk'] = "Будь ласка, заповніть поля 'новий пароль' та 'повторний пароль'";
                textChangeEmpty['de'] = "Füllen Sie bitte die neuen und wiederholten Passwortfelder";
                textChangeEmpty['ko'] = "패스워드를 다시 입력하십시오";
                textChangeEmpty['fr'] = "Remplissez les champs de mot de passe nouveaux et répétés";
                textChangeEmpty['eu'] = "Mesedez, bete pasahitz berriaren eta errepikapenaren eremuak";

                var textChangeDistinct = [];
                textChangeDistinct['en'] = 'New password and repeated password are distinct';
                textChangeDistinct['pt'] = 'A nova senha ea repetido diferem';
                textChangeDistinct['ca'] = 'El nou password i el repetit són diferents';
                textChangeDistinct['es'] = 'El nuevo password y el repetido son distintos';
                textChangeDistinct['it'] = 'La nuova password e la ripetuta differiscono';
                textChangeDistinct['du'] = 'New password and repeated password are distinct';
                textChangeDistinct['uk'] = "'Новий пароль' та 'повторний пароль' не співпадають";
                textChangeDistinct['de'] = "Neues und wiederholtes Passwort sind verschieden";
                textChangeDistinct['ko'] = "처음 입력한 패스워드와 다릅니다";
                textChangeDistinct['fr'] = "Le nouveau mot de passe et le mot de passe répété sont distincts";
                textChangeDistinct['eu'] = "Pasahitz berria eta errepikatutako pasahitza desberdinak dira";

                if (this.isAnEmptyField('new_password')) this.someErrors.push({
                    message: textChangeEmpty[bkt_init_widget.lang],
                    field: 'new_password'
                });
                if (this.isAnEmptyField('repeat_password')) this.someErrors.push({
                    message: textChangeEmpty[bkt_init_widget.lang],
                    field: 'repeat_password'
                });

                if (this.attrs['new_password'].length < 6) this.someErrors.push({
                    message: this.getTextChangeLowChars(),
                    field: 'new_password'
                });
                if (this.attrs['repeat_password'].length < 6) this.someErrors.push({
                    message: this.getTextChangeLowChars(),
                    field: 'new_password'
                });

                if (this.attrs['new_password'] !== this.attrs['repeat_password']) {
                    this.someErrors.push({
                        message: textChangeDistinct[bkt_init_widget.lang],
                        field: 'new_password'
                    });
                }

            },
            isAnEmptyField: function(p_sField) {
                if (!this.attrs[p_sField] || (this.attrs[p_sField] && this.attrs[p_sField].replace(' ', '').length <= 0)) {
                    return true;
                }
                return false;
            },
            getName: function() {
                var someNameParts = this.attributes.name.split(" ");
                if (typeof someNameParts[0] === 'undefined') return "";

                return someNameParts[0];
            },
            getSurnames: function() {
                var someNameParts = this.attributes.name.split(" ");
                if (typeof someNameParts[1] === 'undefined') return "";

                someNameParts.shift();
                return someNameParts.join(" ");
            },
            getTextChangeLowChars: function() {
                var textChangeLowChars = [];
                textChangeLowChars['en'] = 'You need at least 6 characters';
                textChangeLowChars['pt'] = 'Você deve digitar pelo menos 6 caracteres';
                textChangeLowChars['ca'] = "Has d'introduir almenys 6 caràcters";
                textChangeLowChars['es'] = 'Debes introducir al menos 6 caracteres';
                textChangeLowChars['it'] = 'È necessario inserire almeno 6 caratteri';
                textChangeLowChars['du'] = 'New password and repeated password are distinct';
                textChangeLowChars['uk'] = "потрібно, не менше 6 символів";
                textChangeLowChars['de'] = "Sie brauchen mindestens 6 Charakteren";
                textChangeLowChars['ko'] = "최소 6개 이상의 문자를 입력하셔야 됩니다";
                textChangeLowChars['fr'] = "Vous avez besoin d'au moins 6 caractères";
                textChangeLowChars['eu'] = "6 karaktere izan behar ditu gutxienez";

                return textChangeLowChars[bkt_init_widget.lang]
            }
        });
        return Client;
    });