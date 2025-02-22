/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    window.isIOS = cordova.platformId === 'ios';
    window.isAndroid = cordova.platformId === 'android';

    // Rig up button click handler
    const audioBtn = document.querySelector('#audioCapture');
    audioBtn.addEventListener('click', audioCapture);

    const imageBtn = document.querySelector('#imageCapture');
    imageBtn.addEventListener('click', imageCapture);
    
    const videoBtn = document.querySelector('#videoCapture');
    videoBtn.addEventListener('click', videoCapture);
}

// MARK: Audio Feature

const audioCaptureOptions = {
    limit: 1
};

function audioCapture() {
    console.log('Audio capture was clicked');
    navigator.device.capture.captureAudio(audioSuccessCb, audioFailureCb,  audioCaptureOptions);
}

function audioSuccessCb(mediaFiles) {
    _successCb('audio', mediaFiles);
}

function audioFailureCb(error) {
    window.alert('Audio Failure: ' + _failureMessage(error));
}

// MARK: Image Feature

const imageCaptureOptions = {
    limit: 1
};

function imageCapture() {
    console.log('Image capture was clicked');
    navigator.device.capture.captureImage(imageSuccessCb, imageFailureCb,  imageCaptureOptions);
}

function imageSuccessCb(mediaFiles) {
    _successCb('image', mediaFiles);
}

function imageFailureCb(error) {
    window.alert('Image Failure: ' + _failureMessage(error));
}

// MARK: Video Feature

const videoCaptureOptions = {
    limit: 1,
    // duration: 60, // seconds
    quality: 1
};

function videoCapture() {
    console.log('Video capture was clicked');
    navigator.device.capture.captureVideo(videoSuccessCb, videoFailureCb,  videoCaptureOptions);
}

function videoSuccessCb(mediaFiles) {
    _successCb('video', mediaFiles);
}

function videoFailureCb(error) {
    window.alert('Video Failure: ' + _failureMessage(error));
}

// MARK: Internals

function resolveLocalFileSystemURLFailureCb(error) {
    console.log('resolveLocalFileSystemURLFailureCb', error);
    window.alert('Error occured resolving file system URL');
}

function _successCb(mediaType, mediaFiles) {
    let path;
    mediaFiles.forEach(mediaFile => {
        path = mediaFile.fullPath;
    });

    console.log(mediaType.charAt(0).toUpperCase() + mediaType.slice(1) + ' Media File: ', path);

    window.resolveLocalFileSystemURL(
        window.isIOS ? 'file://' + path : path,
        function (fileEntry) {
            const fileUrl = window.isIOS
                ? window.WkWebView.convertFilePath(fileEntry.toURL())
                : fileEntry.toURL();
            document.querySelector('#' + mediaType + 'Display').setAttribute('src', fileUrl);
        },
        resolveLocalFileSystemURLFailureCb
    );
}

function _failureMessage(error) {
    switch (error.code) {
        case CaptureError.CAPTURE_INTERNAL_ERR:
            return 'An internal error occurred during.';
        case CaptureError.CAPTURE_APPLICATION_BUSY:
            return 'The application is busy.';
        case CaptureError.CAPTURE_INVALID_ARGUMENT:
            return 'Invalid argument was supplied.';
        case CaptureError.CAPTURE_NO_MEDIA_FILES:
            return 'There are no media files.';
        case CaptureError.CAPTURE_PERMISSION_DENIED:
            return 'Permission was denied.';
        case CaptureError.CAPTURE_NOT_SUPPORTED:
            return 'Selected feature is not supported.';
        default:
            return 'Unknown Error';
    }
}
