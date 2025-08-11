export const createFooter = () => {
  return `
      <footer id="footer">
        <section>
          <form id="contactForm" novalidate>
            <div class="fields">
              <div class="field">
                <label for="fullName">Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  minlength="2"
                  maxlength="50"
                  autocomplete="name"
                />
                <div class="error-message" id="nameError"></div>
              </div>

              <div class="field">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autocomplete="email"
                />
                <div class="error-message" id="emailError"></div>
              </div>

              <div class="field">
                <label for="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minlength="10"
                  maxlength="500"
                  placeholder="Please share your message or enquiry here..."
                ></textarea>
                <div>
                  <div class="char-count" id="charCount">0 / 500</div>
                  <div class="error-message" id="messageError"></div>
                </div>
              </div>
            </div>
            
            <button type="submit" class="submit-btn">
              Send Message
            </button>
            <div id="responseMessage" class="message"></div>



          </form>
        </section>
        <section class="split contact">
          <section class="alt">
            <h3>Address</h3>
            <p>
              Heriot-Watt University<br />
              Edinburgh, EH14 4AS
            </p>
          </section>
          <section>
            <h3>Phone</h3>
            <p><a href="#">(000) 000-0000</a></p>
          </section>
          <section>
            <h3>Email</h3>
            <p><a href="#">rocketry@hw.ac.uk</a></p>
          </section>
          <section>
            <h3>Social</h3>
            <ul class="icons alt">
              <li>
                <a href="#" class="icon brands alt fa-twitter"
                  ><span class="label">Twitter</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands alt fa-facebook-f"
                  ><span class="label">Facebook</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands alt fa-instagram"
                  ><span class="label">Instagram</span></a
                >
              </li>
              <li>
                <a href="#" class="icon brands alt fa-github"
                  ><span class="label">GitHub</span></a
                >
              </li>
            </ul>
          </section>
        </section>
      </footer>
      `
}
