# formValidation

 This is custom validation created by Vadym Hrohul  ©.
 Version 1.0

 Include this file to your project, and use next method on your js:
 validation.validate(form: HTMLFormElement);      --(See example bellow)--

 You just should enter type of validator(s) and name on your input field.
 Type of validator(s) are enter on 'data-validation-type' attribute;
 Name of input field you should enter on 'name' html attribute.
 Example: 
      <input type="text" data-validation-type="required" name="input-name" />

 For use multiple validators, just enter all of validators you need on 'data-validation-type' attribute.
  Example: 
      <input type="email" data-validation-type="required email" name="input-name" />

 Supporting type of validators:
      - required
      - email
      - login
      - min       // Check required min length of input(you should set desired number of characters on 'min' html attribute)
      - max       // The same mechanism as 'min'
      - checkbox

 This validation not support radio inputs yet, it will be fixed on next release. ;-)


 Realization example:
  In your html:
      <form class="user-form">
          <input type="text" data-validation-type="required min" min="6" name="name" />
          <input type="email" data-validation-type="email" name="email" />
          <button type="button" id="submitFormButton">Submit</button>
      </form>

  In your js:
      const submitFormButton = document.getElementById('submitFormButton');

      submitFormButton.addEventListener('click', (e) => {
          let form = document.querySelector('.user-form');
          let validatedForm = validation.validate(form);

          if (validatedForm.isFormValid) {
              submitFormFunction();
              return;
          }
          showErrors();
      })
 
      On 'validatedForm' will return result object, which on this example will be looks like this:
                  {
                      controls: [                            // array of objects all input fields
                          { 
                              name: "name",                  // the name of form field
                              valid: false,                  // is form input valid 
                              validators: {                  // object with validators result
                                    required: false, 
                                    min: false
                                },
                              value: ""                      // the value of input field
                          },
                          { 
                              name: "email"
                              valid: false
                              validators: {email: false}
                              value: ""
                          }
                      ],
                      isFormValid: false,                     // Show if whole form valid
                      values: {                               // Object of values of each validated form field
                           name: "",
                           email: ""
                      }
                  }

  The final object gives you very flexible post-processing of the form.
