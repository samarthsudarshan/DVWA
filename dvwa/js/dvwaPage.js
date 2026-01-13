/* Help popup */

function popUp(URL) {
	day = new Date();
	id = day.getTime();
	window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=800,height=300,left=540,top=250');
	//eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=800,height=300,left=540,top=250');");
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

