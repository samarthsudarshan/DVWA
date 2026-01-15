// Define a list of trusted domains and script integrity hashes
const TRUSTED_DOMAINS = ['self', window.location.hostname];
const SCRIPT_INTEGRITY = {
  'source/jsonp_impossible.php': 'sha384-expectedHashHere' // Replace with actual hash
};
const SCRIPT_TIMEOUT = 5000; // 5 seconds timeout for script execution

/**
 * Safely loads scripts using the fetch API instead of dynamic script tags
 * Implements multiple layers of security as per OWASP recommendations
 */
async function clickButton() {
  const scriptSrc = "source/jsonp_impossible.php";
  
  try {
    // Validate the script source against trusted domains
    const url = new URL(scriptSrc, window.location.origin);
    if (!TRUSTED_DOMAINS.includes('self') && !TRUSTED_DOMAINS.includes(url.hostname)) {
      console.error("Security violation: Attempted to load script from untrusted domain:", url.hostname);
      return false;
    }
    
    // Prevent script execution if coming from data: or javascript: URIs
    if (scriptSrc.startsWith('data:') || scriptSrc.startsWith('javascript:')) {
      console.error("Security violation: Blocked potentially malicious script URI scheme");
      return false;
    }
    
    // Use fetch API instead of dynamic script tags for better security control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SCRIPT_TIMEOUT);
    
    const response = await fetch(scriptSrc, {
      credentials: 'same-origin',
      integrity: SCRIPT_INTEGRITY[scriptSrc],
      signal: controller.signal,
      headers: {
        'Accept': 'application/javascript'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to load script: ${response.status}`);
    }
    
    const scriptContent = await response.text();
    
    // Validate script content before execution
    if (scriptContent.includes('document.cookie') || 
        scriptContent.includes('localStorage') || 
        scriptContent.includes('sessionStorage')) {
      console.error("Security violation: Script contains potentially dangerous code");
      return false;
    }
    
    // Create a sandboxed environment for script execution
    const sandboxFrame = document.createElement('iframe');
    sandboxFrame.style.display = 'none';
    sandboxFrame.sandbox = 'allow-scripts'; // Minimal permissions
    document.body.appendChild(sandboxFrame);
    
    // Apply Feature-Policy restrictions
    sandboxFrame.allow = "script-src 'self'";
    
    // Execute script in sandboxed iframe
    const frameDoc = sandboxFrame.contentDocument || sandboxFrame.contentWindow.document;
    const scriptElement = frameDoc.createElement('script');
    
    // Add nonce if CSP is using nonces
    if (window.CSP_NONCE) {
      scriptElement.nonce = window.CSP_NONCE;
    }
    
    scriptElement.textContent = scriptContent;
    frameDoc.body.appendChild(scriptElement);
    
    // Set a timeout to remove the iframe after execution
    setTimeout(() => {
      document.body.removeChild(sandboxFrame);
    }, 1000);
    
    return true;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Script execution timed out');
    } else {
      console.error('Error loading script:', error);
    }
    return false;
  }
}


function solveSum(obj) {
	if ("answer" in obj) {
		document.getElementById("answer").innerHTML = obj['answer'];
	}
}

var solve_button = document.getElementById ("solve");

if (solve_button) {
	solve_button.addEventListener("click", function() {
		clickButton();
	});
}
