// This is custom validation created by Vadym Hrohul  ©.
// Version 1.0

// Include this file to your project, and use next method on your js:
// validation.validate(form: HTMLFormElement);      --(See example bellow)--

// You just should enter type of validator(s) and name on your input field.
// Type of validator(s) are enter on 'data-validation-type' attribute;
// Name of input field you should enter on 'name' html attribute.
// Example: 
//      <input type="text" data-validation-type="required" name="input-name" />

// For use multiple validators, just enter all of validators you need on 'data-validation-type' attribute.
//  Example: 
//      <input type="email" data-validation-type="required email" name="input-name" />

// Supporting type of validators:
//      - required
//      - email
//      - login
//      - min       // Check required min length of input(you should set desired number of characters on 'min' html attribute)
//      - max       // The same mechanism as 'min'
//      - checkbox

// This validation not support radio inputs yet, it will be fixed on next release. ;-)


// Realization example:
//  In your html:
//      <form class="user-form">
//          <input type="text" data-validation-type="required min" min="6" name="name" />
//          <input type="email" data-validation-type="email" name="email" />
//          <button type="button" id="submitFormButton">Submit</button>
//      </form>

//  In your js:
//      const submitFormButton = document.getElementById('submitFormButton');

//      submitFormButton.addEventListener('click', (e) => {
//          let form = document.querySelector('.user-form');
//          let validatedForm = validation.validate(form);

//          if (validatedForm.isFormValid) {
//              submitFormFunction();
//              return;
//          }
//          showErrors();
//      })
// 
//      On 'validatedForm' will return result object, which on this example will be looks like this:
//                  {
//                      controls: [                            // array of objects all input fields
//                          { 
//                              name: "name",                  // the name of form field
//                              valid: false,                  // is form input valid 
//                              validators: {                  // object with validators result
//                                    required: false, 
//                                    min: false
//                                },
//                              value: ""                      // the value of input field
//                          },
//                          { 
//                              name: "email"
//                              valid: false
//                              validators: {email: false}
//                              value: ""
//                          }
//                      ],
//                      isFormValid: false,                     // Show if whole form valid
//                      values: {                               // Object of values of each validated form field
//                           name: "",
//                           email: ""
//                      }
//                  }

//  The final object gives you very flexible post-processing of the form.




let validation = {
    _formResult: {
        isFormValid: true,
        controls: [],
        values: {}
    },
    _formReset: function () {
        this._formResult = {
            isFormValid: true,
            controls: [],
            values: {}
        };
    },
    _required: function (htmlInputElement) {
        let value = htmlInputElement.value;

        if (value && (value.trim() != '')) {
            return true;
        } else {
            this._formResult.isFormValid = false;
            return false;
        }
    },
    _email: function (htmlInputElement) {
        let value = htmlInputElement.value;
        const emailPattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
        let patternTest = emailPattern.test(value);
        if (!patternTest) {
            this._formResult.isFormValid = false;
        }

        return patternTest;
    },
    _login: function (htmlInputElement) {
        let value = htmlInputElement.value;
        const namePattern = /^[a-zA-Z0-9-]{6,50}$/i;
        let patternTest = namePattern.test(value);

        if (patternTest) {
        } else {
            this._formResult.isFormValid = false;
        }
        return patternTest;
    },
    _checkbox: function (htmlInputElement) {
        let value = htmlInputElement.checked;

        if (!value) {
            this._formResult.isFormValid = false;
        }

        return value;
    },
    _min: function (htmlInputElement) {
        let value = htmlInputElement.value;
        let minValue = +htmlInputElement.getAttribute('min');

        if (value.length < minValue) {
            this._formResult.isFormValid = false;
            return false;
        } else {
            return true;
        }
    },
    _max: function (htmlInputElement) {
        let value = htmlInputElement.value;
        let maxValue = +htmlInputElement.getAttribute('max');
        if (value.length > maxValue) {
            this._formResult.isFormValid = false;
            return false;
        } else {
            return true;
        }
    },
    _validateField: function (htmlInputElement) {
        let result = {
            name: htmlInputElement.name,
            value: htmlInputElement.value,
            valid: true,
            validators: {}
        };
        let fieldValidators = htmlInputElement.dataset.validationType.split(' ');
        fieldValidators.forEach(validator => {
            result.validators[validator] = this['_' + validator](htmlInputElement);
        });

        for (let key in result.validators) {
            if (result.validators[key] === false) {
                result.valid = false;
            }
        }
        return result;
    },
    validate: function (form) {
        let fieldsForValidate = form.querySelectorAll('[data-validation-type]');
        this._formReset();

        [...fieldsForValidate].forEach(htmlInputElement => {
            const validatedFieldObj = this._validateField(htmlInputElement)
            this._formResult.controls.push(validatedFieldObj);
            this._formResult.values[validatedFieldObj.name] = validatedFieldObj.value;
        });

        return this._formResult;
    }
}
