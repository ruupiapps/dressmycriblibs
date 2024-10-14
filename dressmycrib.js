
// Get the form element
const getDeviceInfoUrl = "https://general.ruupi.com/getdeviceinfo";

let browser_fallback_url_android = "https://ar-api.dressmycrib.com/unkown_android.html";

//const browser_fallback_url_android = window.location.href;
const ios_fail_url = "https://ar-api.dressmycrib.com/unknown_ios.html";
// const general_fail_url = "https://ar-api.dressmycrib.com/not-supported-device.html";

let closeQRCodeModalButton = undefined;
let qrCodeModal = undefined;
let qrcodeContainer = undefined;
let qrCodeModalMessage = undefined;
let qrCodeMModalOKButton = undefined;

let closeInfoModalButton = undefined;
let infoModal = undefined;
let infoContainer = undefined;
let infoModalMessage = undefined;
let infoModalSpinner = undefined;

let uploadingIsInProgress = false;

let closeErrorModalButton = undefined;
let errorModal = undefined;
let errorContainer = undefined;
let errorModalMessage = undefined;
let errorModalOKButton = undefined;




const DEVICE_TYPE_ANDROID = "Android";
const DEVICE_TYPE_IOS = "iOS";
const DEVICE_TYPE_DESKTOP = "Desktop";



const QR_CODE_MODAL_TEXT = "Point your camera at the QR code to launch augmented reality visual.";

const PLEASE_WAIT_TEXT = "Please wait..";
const NOT_SUITABLE_ANDROID_MSG = "Sorry, your Android device is not supporting Augmented Reality feature.";
const NOT_SUITABLE_IOS_MSG = "Sorry, your Apple device is not supporting Augmented Reality feature. Please run it from Safari or Chrome web browser starting from IOS 17.";
const NOT_SUITABLE_GENERAL_MSG = "Sorry - your enviroment does not support Augmented Reality.";


let qrCodeText = QR_CODE_MODAL_TEXT;
let pleaseWaitText = PLEASE_WAIT_TEXT;
let notSuitableAndroidMsg = NOT_SUITABLE_ANDROID_MSG;
let notSuitableAppleDeviceMsg = NOT_SUITABLE_IOS_MSG;
let notSuitableDeviceGeneralMsg = NOT_SUITABLE_GENERAL_MSG;


let deviceType = getDeviceType();

const qrCodeModalHtml = `
        <!-- Include styles for the modal -->
        <style>
            /* Modal styles */
            .dmc-qrcode-modal {
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
            .dmc-qrcode-modal-content {
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
            .dmc-qrcode-modal-content .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            }
        
            /* Please wait message */
            .dmc-qrcode-modal-content p {
                margin: 0;
            }

            .dmc_qrcode-container{
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 20px;
            }

            #dmc-qrcode-id{
             display: flex;
                justify-content: center;
            }

            
            #dmc-qrcode-ok-btn-id{
                min-width: 100px;
                 border: 1px solid #1e1d1c;
                -webkit-transition: background-color .55s ease-out, color .1s ease-out;
                transition: background-color .55s ease-out, color .1s ease-out;
                background-color: #1e1d1c;
                color: #fff;
                display: block;
                font-size: 16px;
                font-weight: 500;
                padding: 16px 32px;
                text-align: center;
                width: 100%;
                cursor: pointer;
            }
        </style>
        <!-- Overlay for the modal -->
        <div id="overlay"></div>
        
        <!-- Modal structure -->
        <div id="dmc-qrcode-modal-id" class="dmc-qrcode-modal">
            <div class="dmc-qrcode-modal-content">
                <!-- Close button -->
                <span class="close-btn" id="dmc-qrcode-close-modal-button-id">&times;</span>
               <div class="dmc_qrcode-container">
                    <div id="dmc-qrcode-id"></div>
                    <div id="dmc-qrcode-message-id"></div>
                    <button id="dmc-qrcode-ok-btn-id">Close</button>
               </div>
            </div>
        </div>
        `;


const infoModalHtml = `
        <!-- Include styles for the modal -->
        <style>
            /* Modal styles */
            .dmc-info-modal {
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
            .dmc-info-modal-content {
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
            .dmc-info-modal-content .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            }
        
            /* Please wait message */
            .dmc-info-modal-content p {
                margin: 0;
            }

            .dmc_info-container{
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
            }

            #dmc-info-id{
             display: flex;
                justify-content: center;
            }



            .dmc-info-spin-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dmc-info-spin-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dmc-info-circular-chart {
    max-width: 100%;
    max-height: 100%;
    display: block;
}

.dmc-info-circle {
    fill: none;
    stroke-width: 4;
    stroke: #888888; /* Gray color */
    stroke-dasharray: 5, 5; /* Dashed stroke for better visibility */
    stroke-linecap: round;
    transform-origin: 50% 50%;
    animation: dmc-info-spin 2s linear infinite;
}

@keyframes dmc-info-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}




        </style>
        <!-- Overlay for the modal -->
        <div id="overlay"></div>
        
        <!-- Modal structure -->
        <div id="dmc-info-modal-id" class="dmc-info-modal">
            <div class="dmc-info-modal-content">
                <!-- Close button -->
                <span class="close-btn" id="dmc-info-close-modal-button-id">&times;</span>
               <div class="dmc_info-container">
                <div class="dmc-info-spin-container" id="dmc-info-spinner-id">
             <svg width="20" height="20" viewBox="0 0 36 36" class="dmc-info-circular-chart">
            <path class="dmc-info-circle"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
    </div>
                    <div id="dmc-info-message-id"></div>
   
               </div>
            </div>
        </div>
        `;




const errorModalHtml = `
        <!-- Include styles for the modal -->
        <style>
            /* Modal styles */
            .dmc-error-modal {
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
            .dmc-error-modal-content {
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
            .dmc-error-modal-content .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
            }
        
            /* Please wait message */
            .dmc-error-modal-content p {
                margin: 0;
            }

            .dmc_error-container{
                display: flex;
                    
                align-items: center;
                gap: 20px;
                flex-direction: column;
            }

            #dmc-error-id{
             display: flex;
                justify-content: center;
            }


            #dmc-error-ok-btn-id{
                min-width: 100px;
                 border: 1px solid #1e1d1c;
                -webkit-transition: background-color .55s ease-out, color .1s ease-out;
                transition: background-color .55s ease-out, color .1s ease-out;
                background-color: #1e1d1c;
                color: #fff;
                display: block;
                font-size: 16px;
                font-weight: 500;
                padding: 16px 32px;
                text-align: center;
                width: 100%;
                cursor: pointer;
            }


        </style>
        <!-- Overlay for the modal -->
        <div id="overlay"></div>
        
        <!-- Modal structure -->
        <div id="dmc-error-modal-id" class="dmc-error-modal">
            <div class="dmc-error-modal-content">
                <!-- Close button -->
                <span class="close-btn" id="dmc-error-close-modal-button-id">&times;</span>
               <div class="dmc_error-container">
                       <div id="dmc-error-message-id"></div>
                       <button id="dmc-error-ok-btn-id">OK</button>
               </div>
            </div>
        </div>
        `;

// Function to fetch HTML content from an external file
async function fetchAndAppendHTML() {
    try {
        // Append the fetched HTML content directly to the body
        document.body.innerHTML += qrCodeModalHtml;
        document.body.innerHTML += infoModalHtml;
        document.body.innerHTML += errorModalHtml;
        closeQRCodeModalButton = document.getElementById('dmc-qrcode-close-modal-button-id');
        qrCodeModal = document.getElementById('dmc-qrcode-modal-id');
        // overlay = document.getElementById('overlay');
        qrcodeContainer = document.getElementById('dmc-qrcode-id');
        qrCodeModalMessage = document.getElementById('dmc-qrcode-message-id');
        qrCodeMModalOKButton = document.getElementById('dmc-qrcode-ok-btn-id');
        closeQRCodeModalButton.addEventListener('click', closeQrCodeModal);
        qrCodeMModalOKButton.addEventListener('click', closeQrCodeModal);



        closeInfoModalButton = document.getElementById('dmc-info-close-modal-button-id');
        infoModal = document.getElementById('dmc-info-modal-id');
        infoModalMessage = document.getElementById('dmc-info-message-id');
        infoModalSpinner = document.getElementById('dmc-info-spinner-id');
        closeInfoModalButton.addEventListener('click', stopUploadingProgress);


        errorModalOKButton = document.getElementById('dmc-error-ok-btn-id');
        closeErrorModalButton = document.getElementById('dmc-error-close-modal-button-id');
        errorModal = document.getElementById('dmc-error-modal-id');
        errorModalMessage = document.getElementById('dmc-error-message-id');
        closeErrorModalButton.addEventListener('click', closeErrorModal);
        errorModalOKButton.addEventListener('click', closeErrorModal);






        // overlay.addEventListener('click', closeModal);


    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

// Fetch and append the HTML content when the page loads
window.addEventListener('DOMContentLoaded', fetchAndAppendHTML);



async function openARPainting(imageFileUrl,
    height,
    qrCodeText = QR_CODE_MODAL_TEXT,
    pleaseWaitText = PLEASE_WAIT_TEXT,
    notSuitableAndroidMsg = NOT_SUITABLE_ANDROID_MSG,
    notSuitableAppleDeviceMsg = NOT_SUITABLE_IOS_MSG,
    notSuitableDeviceGeneralMsg = NOT_SUITABLE_GENERAL_MSG,

) {
    uploadingIsInProgress = true;

    window.qrCodeText = qrCodeText;
    window.pleaseWaitText = pleaseWaitText;
    window.notSuitableAndroidMsg = notSuitableAndroidMsg;
    window.notSuitableAppleDeviceMsg = notSuitableAppleDeviceMsg;
    window.notSuitableDeviceGeneralMsg = notSuitableDeviceGeneralMsg;

    showMessageInfoModal(window.pleaseWaitText);
    // showErrorMessageModal(NOT_SUITABLE_ANDROID_MSG);
    const startConvertingAR = async () => {
        let imageFile = await fetch(imageFileUrl).then(r => r.blob());
        if (!uploadingIsInProgress) {
            return false;
        }
        await openARPaintingImageFile(imageFile, height, window.qrCodeText);
        closeInfoModal();
    }
    //check if it is ios, android (mobile or tablet) or desktop
    switch (deviceType) {
        case DEVICE_TYPE_ANDROID:
            startConvertingAR();
            break;
        case DEVICE_TYPE_IOS:
            //check if browser is correct
            if (typeof window === 'object') {
                const anchor = document.createElement("a");

                let Http = new XMLHttpRequest();
                Http.open("GET", getDeviceInfoUrl);
                Http.send();
                if (!uploadingIsInProgress) {
                    return false;
                }
                Http.onreadystatechange = function () {
                    if (!uploadingIsInProgress) {
                        return false;
                    }
                    if (this.readyState == 4 && this.status == 200) {
                        if (!uploadingIsInProgress) {
                            return false;
                        }
                        // let deviceClass;
                        // let operatingSystemName;
                        // let operatingSystemVersion;
                        let agentName;
                        let userAgentDataObj = JSON.parse(Http.responseText);
                        deviceClass = userAgentDataObj.deviceClass.toLowerCase();
                        operatingSystemName = userAgentDataObj.operatingSystemName.toLowerCase();;
                        operatingSystemVersion = userAgentDataObj.operatingSystemVersion.toLowerCase();
                        agentName = userAgentDataObj.agentName.toLowerCase();
                        if (!uploadingIsInProgress) {
                            return false;
                        }

                        if (anchor.relList.supports("ar")) { //ios which is supporting AR
                            if (!uploadingIsInProgress) {
                                return false;
                            }

                            switch (agentName) {
                                // case "uiwebview":
                                // case "pinterest":
                                //     showMessageInfoModal("Sorry, this feature is not supported in not safari browser.");
                                //     break;

                                case "safari":
                                case "chrome":
                                    startConvertingAR();
                                    break;



                                default:
                                    closeInfoModal();
                                    showErrorMessageModal(window.notSuitableAppleDeviceMsg);
                                    return;


                            }
                        } else {
                            switch (agentName) {
                                case "chrome": //special case, where in chrome feature is supported
                                    startConvertingAR();
                                    break;
                                default:
                                    closeInfoModal();
                                    showErrorMessageModal(window.notSuitableAppleDeviceMsg);
                                    return;
                            }
                        }
                    }
                }
            }
            break;
        default: //Android, Desktop
            startConvertingAR();
            break;
    }






}

// Handle form submission
async function openARPaintingImageFile(imageFile, height, qrCodeText) {
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.fileName);
    if (!uploadingIsInProgress) {
        return false;
    }
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
        if (!uploadingIsInProgress) {
            return false;
        }
        // Check the response status
        if (response.ok) {
            // Handle successful response
            // Optionally, parse the response JSON if needed
            const data = await response.json();
            if (!uploadingIsInProgress) {
                return false;
            }
            let itemUrl = `https://general.ruupi.com:8443/item/${data.itemId}?enable_vertical_placement=1`;
            if (!uploadingIsInProgress) {
                return false;
            }
            const openQRCodeFunction = () => showQRCodeModal(itemUrl, qrCodeText);
            if (!uploadingIsInProgress) {
                return false;
            }

            closeQrCodeModal();
            if (!uploadingIsInProgress) {
                return false;
            }
            openArObjectIOSAndroid(data.object3dFileUsdz, data.object3dFileGlb, openQRCodeFunction);

            if (!uploadingIsInProgress) {
                return false;
            }
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
    browser_fallback_url_android = window.location.href;

    browser_fallback_url_android = browser_fallback_url_android.includes('?')
        ? `${browser_fallback_url_android}&android-ar-error=true&android-ar-error-text=${encodeURIComponent(window.notSuitableAndroidMsg)}`
        : `${browser_fallback_url_android}?android-ar-error=true&android-ar-error-text=${encodeURIComponent(window.notSuitableAndroidMsg)}`
    let androidArUrl =
        "intent://arvr.google.com/scene-viewer/1.0?file=" + glb + "?mode=ar_only&enable_vertical_placement=true&resizable=false&disable_occlusion=true#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=" +
        browser_fallback_url_android +
        ";end;";
    location.assign(androidArUrl);
}





function loadIOSAR(usdz) {

    if (typeof window === 'object') {
        let anchor = document.createElement("a");
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


    }

}

function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return DEVICE_TYPE_ANDROID;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return DEVICE_TYPE_IOS;
    } else {
        return DEVICE_TYPE_DESKTOP;
    }
}


function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (isTelegramBrowser()) {
        return "Telegram";
    }

    if (isSamsungInternet()) {
        return "Samsung Internet";
    }

    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("Edg") > -1) {
        return "Edge";
    } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
        return "Opera";
    } else if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {
        return "Internet Explorer";
    } else {
        return "Unknown";
    }
}

function isSamsungInternet() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /SamsungBrowser/i.test(userAgent);
}

function isTelegramBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Telegram/i.test(userAgent);
}

function doesIOsSupportAR() {

    const anchor = document.createElement("a");

    return anchor.relList.supports("ar");


}




function checkIfDeviceSupportsAR() {

    return new Promise((resolve) => {
        deviceType = getDeviceType();
        const browserName = getBrowserName();
        debug("deviceType: " + deviceType);
        switch (deviceType) {
            case DEVICE_TYPE_ANDROID:
                if (navigator.xr) {
                    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                        if (supported) {
                            resolve(true); // Request was successful
                        } else {
                            if (browserName === "Chrome" || browserName === "Samsung Internet") {
                                resolve(false);
                            } else {
                                resolve(true); // We are not sure, as navigator.xr is supported ony on Samsung internet or Chrome.
                            }

                        }
                    }).catch((err) => {
                        if (browserName === "Chrome" || browserName === "Samsung Internet") {
                            resolve(false);
                        } else {
                            resolve(true); // We are not sure, as navigator.xr is supported ony on Samsung internet or Chrome.
                        }

                    });
                } else {
                    if (browserName === "Chrome" || browserName === "Samsung Internet") {
                        resolve(false);
                    } else {
                        resolve(true); // We are not sure, as navigator.xr is supported ony on Samsung internet or Chrome.
                    }
                }


                break;
            case DEVICE_TYPE_IOS:
                const iosSupportsAr = doesIOsSupportAR();

                alert("browserName " + browserName);

                // if (browserName != "Safari" ){

                // }
                // debug("kaka 1 " + iosSupportsAr);
                resolve(iosSupportsAr); // Request was successful

            case DEVICE_TYPE_DESKTOP:
                resolve(true); // Request was successful
            default:
                return false;
        }
    });


}


// function debug(message) {
//     const debugContainer = document.getElementById('DMC_DEBUG_ID');

//     if (debugContainer) {
//         debugContainer.innerHTML = debugContainer.innerHTML + " " + message;
//     }

// }

function openArObjectIOSAndroid(usdz, glb, openProductQRDialog) {
    if (!uploadingIsInProgress) {
        return false;
    }

    const deviceType = getDeviceType();
    switch (deviceType) {
        case DEVICE_TYPE_ANDROID:
            loadAndroidAR(glb);
            break;
        case DEVICE_TYPE_IOS:

            loadIOSAR(usdz);
            break;
        case DEVICE_TYPE_DESKTOP:

            openProductQRDialog();
            break;
        default:
            showErrorMessageModal(window.notSuitableDeviceGeneralMsg);
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




function showErrorMessageModal(msg) {
    errorModalMessage.innerHTML = msg;
    // Show the modal and overlay
    errorModal.style.display = 'flex';
}


function showMessageInfoModal(msg, showSpiner = true) {
    infoModalMessage.innerHTML = msg;
    if (!showSpiner) {
        infoModalSpinner.style.display = "none";
    } else {
        infoModalSpinner.style.display = "flex";
    }
    // Show the modal and overlay
    infoModal.style.display = 'flex';
}





// Function to show the QR code modal
function showQRCodeModal(url, qrCodeText = "") {
    closeQrCodeModal();
    // Create a new QR code
    new QRCode(qrcodeContainer, {
        text: url, // Replace with your desired URL
        width: 200,
        height: 200
    });
    qrCodeModalMessage.innerHTML = qrCodeText;
    // Show the modal and overlay
    qrCodeModal.style.display = 'flex';
}


function closeErrorModal() {
    errorModal.style.display = 'none';
}

// Function to close the modal
function closeQrCodeModal() {
    // Clear the QR code
    qrcodeContainer.innerHTML = '';
    qrCodeModalMessage.innerHTML = '';
    // Hide the modal and overlay
    qrCodeModal.style.display = 'none';
}

// Function to close the modal
function closeInfoModal() {
    infoModalMessage.innerHTML = '';
    infoModal.style.display = 'none';

}


function stopUploadingProgress() {
    uploadingIsInProgress = false;
    closeInfoModal();
}



function removeUrlParameter(param) {
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    // Check if the parameter exists
    if (params.has(param)) {
        // Remove the parameter
        params.delete(param);
        // Update the URL without reloading the page
        window.history.replaceState({}, document.title, currentUrl.toString());
    }
}

window.onload = function () {

    const urlSearchParam = new URLSearchParams(window.location.search);
    // Check for the condition (replace with your actual condition)
    if (urlSearchParam.has('android-ar-error')) {
        let errorMessage = NOT_SUITABLE_ANDROID_MSG;
        if (urlSearchParam.has('android-ar-error-text')) {
            errorMessage = urlSearchParam.get('android-ar-error-text');
            removeUrlParameter('android-ar-error-text');
        }

        if (!window.notSuitableAndroidMsg) {
            window.notSuitableAndroidMsg = errorMessage;
        }
        showErrorMessageModal(errorMessage);
        removeUrlParameter('android-ar-error');


    }
};