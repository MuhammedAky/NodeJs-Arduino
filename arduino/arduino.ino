const int ledPin = 6;

const int potPin = A0;

String ledStatus = "off";

int lastPotVal = 0;

String inputString = "";

boolean stringComplete = false;

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);
    pinMode(potPin, INPUT);
}

void loop() {
    listenPotChanges();

    updateLedStatus();
}

void listenPotChanges() {
    const int THRESHOLD = 10;

    int potVal = analogRead(potPin);

    if (abs(potVal - lastPotVal) > THRESHOLD) {
        Serial.print("Pot: ");
        Serial.println(potVal);
        delay(50);
        lastPotVal = potVal;
    }
}

void updateLedStatus() {
    if (stringComplete) {
        if (inputString == "on\r") {
            ledStatus = "on";
        }
        if (inputString == "off\r") {
            ledStatus = "off";
        }

        Serial.println(ledStatus);
        inputString = "";
        stringComplete = false;
    }

    digitalWrite(ledPin, ledStatus == "on" ? HIGH : LOW);
}

void serialEvent() {
    while (Serial.available()) {
        char inChar = (char)Serial.read();

        inputString += inChar;

        if (inChar == "\r") {
            stringComplete = true;
        }
    }
}