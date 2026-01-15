import "./ContactSection.css";

export default function ContactSection({ id = "contact" }) {
  return (
    <section id={id} className="contact">
      <h2 className="section-title">Contact Us</h2>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
}
