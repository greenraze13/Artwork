Installing all dependencies in for development
Please follow this guide and install the correct dependencies for your current OS and the OS that you want to build (iOS or Android)

https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies

Running android
This is a straightforward process.

$react-native run-android

You need to have an emulator running or an Android device connected to your computer to make it work

Running iOS
This one needs a bit more of work.

Follow this steps:

1) Open xcode
2) click on "open another project"
3) Browse to the this application folder, then /ios, then open AppName.xcworkspace
4) Should run 'pod install' or 'pod update' to generate Pods for project
5) Sign the application with your certificate
6) Run react-native run-ios from project home folder.

https://facebook.github.io/react-native/docs/running-on-device

run this
export CC=clang

after that :go to xcode/preferences/location/ and command line tools select latest one

run brew update

### Solution for: third-party error in xcode
cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../

and

cd node_modules/react-native/third-party/glog-0.3.5/ && ../../scripts/ios-configure-glog.sh && cd ../../../../

### Development Environment
brew install gcc
node : 12.6.0

### FIXES android:
If you don't have real bundle in your release app for android before you run ./gradlew assembleRelease from /projectName/android/
You need to run this:
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
from $projectName/

### Usage react-native-vector-icons:
rm ./node_modules/react-native/local-cli/core/fixtures/files/package.json
Delete file package.json

