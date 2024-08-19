
// Get the form element
let getDeviceInfoUrl = "https://general.ruupi.com/getdeviceinfo";
let path_to_html = "dressmycrib.html";

const browser_fallback_url_android = "https://ar-api.dressmycrib.com/unkown_android.html";
const ios_fail_url = "https://ar-api.dressmycrib.com/unknown_ios.html";
// const general_fail_url = "https://ar-api.dressmycrib.com/not-supported-device.html";

let closeModalButton = undefined;
let modal = undefined;
// let overlay = undefined;
let qrcodeContainer = undefined;
let messageContainer = undefined;


// Function to fetch HTML content from an external file
async function fetchAndAppendHTML() {
    try {
        const htmlContent = `
        <!-- Include styles for the modal -->
        <style>
            /* Modal styles */
            .modal {
                display: none;
                /* Initially hide the modal */
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                /* Semi-transparent background */
                justify-content: center;
                align-items: center;
            }
        
            /* Modal content styles */
            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 5px;
                text-align: center;
                position: relative;
                max-width: 300px;
                display: flex;
                justify-content: center;
            }
        
            /* Close icon styles */
            .modal-content .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            }
        
            /* Please wait message */
            .modal-content p {
                margin: 0;
            }
        </style>
        <!-- Overlay for the modal -->
        <div id="overlay"></div>
        
        <!-- Modal structure -->
        <div id="modal" class="modal">
            <div class="modal-content">
                <!-- Close button -->
                <span class="close-btn" id="closeModalButton">&times;</span>
                <div id="qrcode"></div>
                <div id="id-dress-mycrib-msg"></div>
            </div>
        </div>
        `;
        // Append the fetched HTML content directly to the body
        document.body.innerHTML += htmlContent;
        closeModalButton = document.getElementById('closeModalButton');
        modal = document.getElementById('modal');
        // overlay = document.getElementById('overlay');
        qrcodeContainer = document.getElementById('qrcode');
        messageContainer = document.getElementById('id-dress-mycrib-msg');
        closeModalButton.addEventListener('click', closeModal);
        // overlay.addEventListener('click', closeModal);


    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

// Fetch and append the HTML content when the page loads
window.addEventListener('DOMContentLoaded', fetchAndAppendHTML);

async function handleOpenARUsingForm(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();
    const form = event.target;
    const imageFile = form.elements['file'].files[0];
    const height = form.elements['height'].value;
    await openARPaintingImageFile(imageFile, height);
}

async function openARPainting(imageFileUrl, height) {
    showMessageModal("Please wait..");
    let imageFile = await fetch(imageFileUrl).then(r => r.blob());
    await openARPaintingImageFile(imageFile, height);

}

// Handle form submission
async function openARPaintingImageFile(imageFile, height) {
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.fileName);

    const productName = generateUniqueId();
    try {
        // Make a POST request to the server with the form data
        const response = await fetch("https://general.ruupi.com:8080/generatePainting?" +
            new URLSearchParams(
                {
                    writeNameDimensOnRug: false,
                    clientId: '14',
                    productId: productName,
                    height: height,
                    units: '1',
                    productName: productName,
                    cutImage: false,
                    withIndicator: false,
                }
            ), {
            method: 'POST',
            body: formData,
        });

        // Check the response status
        if (response.ok) {
            // Handle successful response
            // Optionally, parse the response JSON if needed
            const data = await response.json();
            let itemUrl = `https://general.ruupi.com:8443/item/${data.itemId}`;
            const openQRCodeFunction = () => showQRCodeModal(itemUrl);

            closeModal();
            openArObjectIOSAndroid(data.object3dFileUsdz, data.object3dFileGlb, openQRCodeFunction);


        } else {
            // Handle error response
            console.error('Failed to upload data');
        }
    } catch (error) {
        // Handle network or other errors
        console.error('An error occurred:', error);
    }

}


function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Convert timestamp to base-36 for shorter representation
    const randomPart = Math.random().toString(36).substring(2, 8); // Random number as base-36
    return timestamp + randomPart;
}



function loadAndroidAR(glb) {
    let androidArUrl =
        "intent://arvr.google.com/scene-viewer/1.0?file=" + glb + "?mode=ar_only&resizable=false&disable_occlusion=true#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=" +
        browser_fallback_url_android +
        ";end;";
    location.assign(androidArUrl);
}



function loadIOSAR(agentName, usdz) {
    if (typeof window === 'object') {
        let anchor = document.createElement("a");
        switch (agentName) {
            // case "uiwebview":
            case "pinterest":
                // case "instagram":
                alert("Please open this page in Safari Web Browser to view 3d Rugs in Your space.");
                break;
            case "uiwebview":
            case "pinterest":
                location.href = ios_fail_url;
            default:
                let iosUrl = usdz
                    +
                    "#allowsContentScaling=0";
                anchor = document.createElement("a");
                anchor.setAttribute("href", iosUrl);
                anchor.setAttribute("rel", "ar");
                anchor.appendChild(document.createElement("img")); //we need to setup this dummy image, as requirement: https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look
                anchor.addEventListener(
                    "message",
                    function (event) {
                        // if (event.data == "_apple_ar_quicklook_button_tapped") {
                        //     window.open(affiliateLink, "_blank");
                        // }
                    },
                    false
                );
                anchor.click();

                break;
        }
    }

}

function openArObjectIOSAndroid(usdz, glb, openProductQRDialog) {
    if (typeof window === 'object') {
        const anchor = document.createElement("a");
        let Http = new XMLHttpRequest();
        Http.open("GET", getDeviceInfoUrl);
        Http.send();

        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let deviceClass;
                let operatingSystemName;
                let operatingSystemVersion;
                let agentName;
                let userAgentDataObj = JSON.parse(Http.responseText);
                deviceClass = userAgentDataObj.deviceClass.toLowerCase();
                operatingSystemName = userAgentDataObj.operatingSystemName.toLowerCase();;
                operatingSystemVersion = userAgentDataObj.operatingSystemVersion.toLowerCase();
                agentName = userAgentDataObj.agentName.toLowerCase();
                if (anchor.relList.supports("ar")) { //ios which is supporting AR
                    loadIOSAR(agentName, usdz);
                    return;
                } else {
                    if (deviceClass == "desktop") {
                        if (openProductQRDialog != null) {
                            openProductQRDialog();
                        }
                    } else {
                        if (operatingSystemName == "android" && (deviceClass == "phone" || deviceClass == "tablet")) {
                            loadAndroidAR(glb);
                            return;
                        } else {
                            location.href = browser_fallback_url_android;
                        }
                    }
                }
            }
        }
    }
}





// Function to detect the device type based on user agent
function detectDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Regular expressions to match different types of devices
    const mobileRegex = /android|iphone|ipod|blackberry|windows phone|opera mini|iemobile/i;
    // const tabletRegex = /ipad|tablet|playbook|kindle|silk/i;
    const tabletRegex = /ipad|tablet/i;

    // Check if the user agent matches a mobile device
    if (mobileRegex.test(userAgent)) {
        return 'mobile';
    }

    // Check if the user agent matches a tablet device
    if (tabletRegex.test(userAgent)) {
        return 'tablet';
    }

    // If neither mobile nor tablet matches, assume desktop
    return 'desktop';
}



function showMessageModal(msg) {
    messageContainer.innerHTML = msg;
    // Show the modal and overlay
    modal.style.display = 'flex';
    // overlay.style.display = 'block';
}





// Function to show the QR code modal
function showQRCodeModal(url) {
    closeModal();
    // Create a new QR code
    new QRCode(qrcodeContainer, {
        text: url, // Replace with your desired URL
        width: 200,
        height: 200
    });

    // Show the modal and overlay
    modal.style.display = 'flex';
    // overlay.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    // Clear the QR code
    qrcodeContainer.innerHTML = '';
    messageContainer.innerHTML = '';
    // Hide the modal and overlay
    modal.style.display = 'none';
    // overlay.style.display = 'none';
}


