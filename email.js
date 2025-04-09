export const getSchedulingEmailTemplate = (appointment, date, time, notes) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Viewing Scheduled</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Hybrid Realty Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${time}
        </p>
        ${notes ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Notes:</strong> ${notes}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
            We will confirm your appointment shortly
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@HybridRealty.com" style="color: #2563eb; text-decoration: none;">support@hybridrealty.com</a>
          <br>
          📞 <a href="tel:+919999999999" style="color: #2563eb; text-decoration: none;">+1 (234) 567-890</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://hybridrealty.com" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;


export const getEmailTemplate = (appointment, status) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Hybrid Realty Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: ${
            status === 'confirmed' ? '#dcfce7' : status === 'cancelled' ? '#fee2e2' : '#fef3c7'
          }; color: ${
            status === 'confirmed' ? '#166534' : status === 'cancelled' ? '#991b1b' : '#854d0e'
          };">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${status === 'confirmed' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Arrive 10 minutes before your scheduled time
            </li>
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Bring valid identification
            </li>
          ` : status === 'cancelled' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #991b1b;">i</span>
              You can schedule another viewing at any time
            </li>
          ` : `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
              We will confirm your appointment shortly
            </li>
          `}
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@hybridrealty.com" style="color: #2563eb; text-decoration: none;">support@hybridrealty.com</a>
          <br>
          📞 <a href="tel:+919999999999" style="color: #2563eb; text-decoration: none;">+1 (234) 567-890</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://hybridrealty.com" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getNewsletterTemplate = (email) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Hybrid Realty!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Premier Real Estate Newsletter</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #2563eb;">${email}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Thank you for joining our community of property enthusiasts!
      </p>
    </div>

    <!-- Benefits Section -->
    <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">What You'll Get:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Latest Property Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Real Estate Market Trends
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Exclusive Property Deals
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Investment Opportunities
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Explore Properties
      </a>
    </div>

    <!-- Important Note -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        <strong style="color: #1e40af;">📝 Note:</strong> To ensure you don't miss our updates, please add
        <a href="mailto:support@hybridrealty.com" style="color: #2563eb; text-decoration: none;">support@hybridrealty.com</a>
        to your contacts.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #2563eb; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getWelcomeTemplate = (name) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; border-bottom: 5px solid #f3f4f6;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Welcome to Hybrid Realty!</h1>
    <p style="color: #ecfdf5; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Dream Home Journey Begins</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 35px; padding: 0 10px;">
      <p style="font-size: 20px; color: #4b5563; margin: 0; font-weight: 500;">Hello <strong style="color: #10b981; font-weight: 600;">${name}</strong></p>
      <p style="font-size: 17px; color: #6b7280; margin-top: 12px; line-height: 1.6;">
        Welcome to our community of property enthusiasts! Your account has been successfully created, and we're excited to help you find your perfect property.
      </p>
    </div>

    <!-- Features Section -->
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 25px; border-radius: 12px; margin-bottom: 35px;">
      <h2 style="color: #065f46; margin: 0 0 20px 0; font-size: 22px; border-bottom: 1px solid #d1fae5; padding-bottom: 10px;">Unlock These Features:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 14px; display: flex; align-items: center;">
          <span style="display: inline-block; min-width: 28px; height: 28px; background: #d1fae5; border-radius: 50%; margin-right: 14px; text-align: center; line-height: 28px; color: #065f46; font-weight: bold;">✓</span>
          <span style="font-size: 16px; color: #4b5563;">Browse Premium Property Listings</span>
        </li>
        <li style="margin-bottom: 14px; display: flex; align-items: center;">
          <span style="display: inline-block; min-width: 28px; height: 28px; background: #d1fae5; border-radius: 50%; margin-right: 14px; text-align: center; line-height: 28px; color: #065f46; font-weight: bold;">✓</span>
          <span style="font-size: 16px; color: #4b5563;">Schedule Property Viewings</span>
        </li>
        <li style="margin-bottom: 14px; display: flex; align-items: center;">
          <span style="display: inline-block; min-width: 28px; height: 28px; background: #d1fae5; border-radius: 50%; margin-right: 14px; text-align: center; line-height: 28px; color: #065f46; font-weight: bold;">✓</span>
          <span style="font-size: 16px; color: #4b5563;">Save Favorite Properties</span>
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; min-width: 28px; height: 28px; background: #d1fae5; border-radius: 50%; margin-right: 14px; text-align: center; line-height: 28px; color: #065f46; font-weight: bold;">✓</span>
          <span style="font-size: 16px; color: #4b5563;">Direct Contact with Property Owners</span>
        </li>
      </ul>
    </div>
    
    <!-- Quick Tips Section -->
    <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin-bottom: 35px;">
      <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Quick Tips to Get Started</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: start; color: #4b5563;">
          <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #10b981;">1.</span>
          <span>Complete your profile with preferences to get personalized recommendations</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: start; color: #4b5563;">
          <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #10b981;">2.</span>
          <span>Set up property alerts to be notified of new listings that match your criteria</span>
        </li>
        <li style="display: flex; align-items: start; color: #4b5563;">
          <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #10b981;">3.</span>
          <span>Download our mobile app to browse properties on the go</span>
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.WEBSITE_URL || 'https://hybridrealty.com'}/properties"
         style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10b981, #047857); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);">
        Start Exploring Properties
      </a>
    </div>

    <!-- Support Section -->
    <div style="margin-top: 35px; padding: 25px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
      <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 20px; border-bottom: 1px solid #e0f2fe; padding-bottom: 10px;">Need Assistance?</h3>
      <p style="margin: 0; color: #1f2937; font-size: 16px;">
        Our support team is available 24/7 to assist you:
        <br><br>
        <span style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📧</span>
          <a href="mailto:support@hybridrealty.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">support@hybridrealty.com</a>
        </span>
        <span style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📞</span>
          <a href="tel:+919999999999" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">+1 (234) 567-890</a>
        </span>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
    <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 15px;">
      <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #ecfdf5; border-radius: 50%; line-height: 36px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/facebook-new.png" alt="Facebook" style="width: 18px; height: 18px; vertical-align: middle;">
      </a>
      <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #ecfdf5; border-radius: 50%; line-height: 36px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/twitter.png" alt="Twitter" style="width: 18px; height: 18px; vertical-align: middle;">
      </a>
      <a href="#" style="display: inline-block; width: 36px; height: 36px; background: #ecfdf5; border-radius: 50%; line-height: 36px;">
        <img src="https://img.icons8.com/ios-filled/24/10b981/instagram-new.png" alt="Instagram" style="width: 18px; height: 18px; vertical-align: middle;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
    </p>
    <div style="margin-top: 15px; display: flex; justify-content: center; gap: 20px;">
      <a href="#" style="color: #10b981; text-decoration: none; font-size: 14px;">Privacy Policy</a>
      <a href="#" style="color: #10b981; text-decoration: none; font-size: 14px;">Terms of Service</a>
      <a href="#" style="color: #10b981; text-decoration: none; font-size: 14px;">Contact Us</a>
    </div>
  </div>
</div>
`;

// Add this to your existing email.js file

export const getVerificationOTPTemplate = (otp) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; border-bottom: 5px solid #f3f4f6;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Verify Your Email</h1>
      <p style="color: #ede9fe; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Hybrid Realty Account Verification</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
      <!-- Verification Notice Box -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f5f3ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-3.5"></path>
            <path d="M14 2v4"></path>
            <path d="M10 2v4"></path>
            <path d="M10 16l2 2 4-5"></path>
          </svg>
        </div>
        <h2 style="color: #4b5563; font-size: 22px; margin: 0 0 10px;">Almost there!</h2>
        <p style="color: #6b7280; font-size: 16px; margin: 0 0 5px; line-height: 1.6;">
          Thank you for registering with Hybrid Realty.
        </p>
        <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.6;">
          To complete your account setup, please use the verification code below.
        </p>
      </div>

      <!-- OTP Display -->
      <div style="text-align: center; margin: 35px 0; padding: 0 10px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
        <div style="display: inline-block; padding: 20px 40px; background: #f5f3ff; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6d28d9; border-radius: 12px; border: 1px dashed #c4b5fd;">
          ${otp}
        </div>
        <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
      </div>

      <!-- Security Tips -->
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 25px; border-radius: 12px; margin: 30px 0;">
        <h3 style="color: #b91c1c; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Security Notice
        </h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center; color: #4b5563; font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 16px; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Never share this verification code with anyone
          </li>
          <li style="display: flex; align-items: center; color: #4b5563; font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 16px; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Hybrid Realty staff will never ask for this code
          </li>
        </ul>
      </div>

      <!-- Button -->
      <div style="text-align: center; margin: 35px 0 20px;">
        <p style="color: #6b7280; font-size: 15px; margin: 0 0 15px;">
          Having trouble? Try these options:
        </p>
        <a href="#" 
           style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; margin-right: 10px;">
          Resend Code
        </a>
        <a href="#" 
           style="display: inline-block; padding: 12px 24px; background: white; color: #8b5cf6; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; border: 1px solid #c4b5fd;">
          Contact Support
        </a>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 35px; padding: 25px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369a1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Need Help?
        </h3>
        <p style="margin: 0; color: #4b5563; font-size: 15px;">
          If you didn't request this verification or need assistance:
          <br><br>
          <span style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📧</span>
            <a href="mailto:support@hybridrealty.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">support@hybridrealty.com</a>
          </span>
          <span style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📞</span>
            <a href="tel:++919999999999" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">+1 (234) 567-890</a>
          </span>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
      </p>
      <div style="margin-top: 10px; display: flex; justify-content: center; gap: 20px;">
        <a href="#" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">Website</a>
        <a href="#" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">Privacy Policy</a>
        <a href="#" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getPasswordResetTemplate = (resetUrl) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; border-bottom: 5px solid #f3f4f6;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Reset Your Password</h1>
      <p style="color: #ffe4e6; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Hybrid Realty Account Security</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
      <!-- Icon and Welcome -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #fff1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 style="color: #4b5563; font-size: 22px; margin: 0 0 10px;">Password Reset Request</h2>
        <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.6;">
          We received a request to reset your password for your Hybrid Realty account.
        </p>
      </div>

      <!-- Security Notice Box -->
      <div style="background: #fff1f2; border-left: 4px solid #f43f5e; padding: 25px; border-radius: 12px; margin-bottom: 35px;">
        <h3 style="color: #be123c; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Security Information
        </h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center; color: #4b5563; font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 16px; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            This link will expire in 10 minutes for security reasons
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center; color: #4b5563; font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 16px; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            If you didn't request this password reset, please ignore this email
          </li>
          <li style="display: flex; align-items: center; color: #4b5563; font-size: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width: 16px; margin-right: 12px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Never share your password or this email with anyone
          </li>
        </ul>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 35px 0;">
        <p style="color: #6b7280; font-size: 15px; margin: 0 0 20px;">
          Click the button below to set up a new password:
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f43f5e, #e11d48); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(244, 63, 94, 0.25);">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          Button not working? Copy and paste this link into your browser:
          <br>
          <a href="${resetUrl}" style="color: #f43f5e; word-break: break-all; font-size: 13px;">${resetUrl}</a>
        </p>
      </div>
      
      <!-- Password Tips -->
      <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin-top: 35px;">
        <h3 style="color: #4b5563; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Password Tips</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center; color: #6b7280; font-size: 15px;">
            <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #f43f5e;">•</span>
            <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center; color: #6b7280; font-size: 15px;">
            <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #f43f5e;">•</span>
            <span>Avoid using easily guessable information like birthdays</span>
          </li>
          <li style="display: flex; align-items: center; color: #6b7280; font-size: 15px;">
            <span style="display: inline-block; min-width: 24px; margin-right: 12px; font-weight: bold; color: #f43f5e;">•</span>
            <span>Use a unique password that you don't use for other accounts</span>
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 35px; padding: 25px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369a1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Need Help?
        </h3>
        <p style="margin: 0; color: #4b5563; font-size: 15px;">
          If you didn't request this reset or need assistance:
          <br><br>
          <span style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📧</span>
            <a href="mailto:security@hybridrealty.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">security@hybridrealty.com</a>
          </span>
          <span style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; margin-right: 10px; text-align: center;">📞</span>
            <a href="tel:++919999999999" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">+1 (234) 567-890</a>
          </span>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding: 0 20px;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        © ${new Date().getFullYear()} Hybrid Realty. All rights reserved.
      </p>
      <div style="margin-top: 15px; display: flex; justify-content: center; gap: 20px;">
        <a href="https://hybridrealty.com" style="color: #f43f5e; text-decoration: none; font-size: 14px;">Website</a>
        <a href="#" style="color: #f43f5e; text-decoration: none; font-size: 14px;">Privacy Policy</a>
        <a href="#" style="color: #f43f5e; text-decoration: none; font-size: 14px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;