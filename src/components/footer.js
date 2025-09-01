export const createFooter = () => {
  return `
   
      <footer id="footer">
        <section>
          <form id="contactForm" >
            <div class="fields">
              <div class="field">
                <label for="fullName">Name *</label>
                <input type="text" id="contactName" name="contactName" required />
              </div>
              <div class="field">
                <label for="email">Email *</label>
                <input type="email" id="contactEmail" name="contactEmail" required />
              </div>
              <div class="field">
                <label for="message">Message *</label>
                <textarea id="message" name="message" required
                  placeholder="Please share your message or enquiry here..."
                ></textarea>
                <div>
                  <div class="char-count" id="charCount">0 / 500</div>
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
          <section>
            <h3>Email</h3>
            <p><a href="#">rocketworks@hw.ac.uk</a></p>
          </section>
          <section class="alt">
            <h3>Address</h3>
            <p>
            Heriot-Watt University<br />
            Edinburgh, EH14 4AS
            </p>
          </section>
          <section>
            <h3>Social</h3>
            <ul class="icons alt">
              <li>
                <a href="https://www.linkedin.com/company/hw-rocket-works/" target="_blank" rel="noopener noreferrer" class="icon brands alt fa-linkedin"
                  ><span class="label">Linkedin</span></a>
              </li>
              <li>
                <a href="https://www.instagram.com/hwrocketworks" target="_blank" rel="noopener noreferrer" class="icon brands alt fa-instagram"
                  ><span class="label">Instagram</span></a>
              </li>
             </ul>
          </section>
        </section>
      </footer>
      `
}
