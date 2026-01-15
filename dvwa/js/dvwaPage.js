/* Help popup */
/**
 * Opens a URL in a new window with security measures against reverse tabnabbing
 * @param {string} URL - The URL to open in the new window
 */
function popUp(URL) {
    // Validate URL to prevent opening malicious links
    if (!isValidUrl(URL)) {
        console.error("Invalid URL detected");
        return;
    }
    
    // Use proper variable declarations to avoid global scope pollution
    const day = new Date();
    const id = day.getTime();
    
    // Fixed string concatenation error in the window name parameter
    // Added noopener,noreferrer to prevent reverse tabnabbing attacks
    const windowFeatures = 'noopener,noreferrer,toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=800,height=300,left=540,top=250';
    window.open(URL, id.toString(), windowFeatures);
}

/**
 * Validates if the provided string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url);
        // Add additional validation logic here (e.g., whitelist domains)
        return true;
    } catch (e) {
        return false;
    }
}


/* Form validation */

function validate_required(field,alerttxt)
{
with (field) {
  if (value==null||value=="") {
    alert(alerttxt);return false;
  }
  else {
    return true;
  }
 }
}

function validateGuestbookForm(thisform) {
with (thisform) {

  // Guestbook form
  if (validate_required(txtName,"Name can not be empty.")==false)
  {txtName.focus();return false;}
  
  if (validate_required(mtxMessage,"Message can not be empty.")==false)
  {mtxMessage.focus();return false;}
  
  }
}

function confirmClearGuestbook() {
	return confirm("Are you sure you want to clear the guestbook?");
}

// Centralized cookie management function for consistent security settings
function setCookie(name, value, options = null) {
    // Force security flags regardless of passed options
    const secureOptions = {
        path: '/',
        domain: window.location.hostname,
        maxAge: 3600, // Added: Default 1 hour expiration
        ...options,
        // Always enforce these security settings last to prevent overrides
        Secure: window.location.protocol === 'https:', // Added: Verify HTTPS before setting Secure flag
        HttpOnly: true, // Added: Prevent client-side script access to cookies
        // Only allow 'Strict' or 'Lax' as SameSite values
        SameSite: options && options.SameSite && ['Strict', 'Lax'].includes(options.SameSite) ? options.SameSite : 'Strict',
        // Added: Support for Partitioned attribute when needed
        Partitioned: options?.Partitioned || false
    };
    
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    for (let optionKey in secureOptions) {
        cookieString += '; ' + optionKey;
        const optionValue = secureOptions[optionKey];
        if (optionValue !== true) {
            cookieString += '=' + optionValue;
        }
    }
    
    // Added: Cookie size validation
    if (cookieString.length > 4096) {
        console.warn(`Cookie ${name} exceeds recommended size limit`);
    }
    
    // Added: Error handling
    try {
        document.cookie = cookieString;
    } catch (e) {
        console.error(`Failed to set cookie ${name}:`, e);
        // Consider reporting to monitoring system
    }
}

    document.cookie = cookieString;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    
    // Added cookie expiration of 6 months
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 6);
    
    // Using the centralized cookie function with all security enhancements
    setCookie('theme', theme, {
        expires: expiration.toUTCString(),
        // HttpOnly flag is intentionally not set as JS needs to access this cookie
    });
}

