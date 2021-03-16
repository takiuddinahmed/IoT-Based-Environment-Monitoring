#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <./secret.h>

// pin conf
#define DHT_PIN 23
#define VOICE_SENSOR_PIN 33
#define CO_SENSOR_PIN 34
#define UV_SENSOR_OUT_PIN 32
#define UV_SENSOR_EN_PIN 35
#define DUST_LED_PIN 27
#define DUST_MEASURE_PIN 35


// definations
#define DATA_UPLOAD_DELAY 20 * 1000
#define DHTTYPE DHT22
#define CO_R0 6400  // 7200
#define CO_CONST_MUL 1538.46
#define CO_CONST_POW -1.709
#define DUST_SAMPLING_TIME 280
#define DUST_DELTA_TIME 40
#define DUST_SLEEP_TIME 9680
#define BOARD_VOLTAGE 3.7
#define NOISE_SAMPLE_TIME 100

//CLASSES
FirebaseAuth auth;
FirebaseConfig config;
FirebaseData firebaseData;

DHT dht(DHT_PIN, DHTTYPE);


// variables
String firebasePath = "/data/";
long long timestamp = -1* DATA_UPLOAD_DELAY;
bool uploaded = false;
float temp = 0.0;
float humidity = 0.0;
float co =0.0;
float noise = 0.0;
float dust = 0.0;
float uv = 0.0;

// functions
float soundLevel ();
float coLevel();
float getAvgAnalog(int, int);
float coCalculateR0();
float uvLevel();
float mapfloat(float,float,float,float,float);
float dustLevel();
float adcToVoltage(int);

void setup()
{
  Serial.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.host = FIREBASE_HOST;
  config.api_key = FIREBASE_API_KEY;
  auth.user.email = FIREBASE_USER;
  auth.user.password = FIREBASE_PASS;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  firebaseData.setResponseSize(1024);

  dht.begin();
  analogReadResolution(10);
  pinMode(DUST_LED_PIN,OUTPUT);
}

void loop()
{

  float _temp = dht.readTemperature();
  float _humidity = dht.readHumidity();
  float _co = coLevel();
  float _noise = soundLevel();
  float _dust = dustLevel();
  float _uv = uvLevel();

  if (isnan(_temp) || isnan(_humidity))
    return;

  if (_temp > temp) temp = _temp;
  if (_humidity > humidity) humidity = _humidity;
  if (_co > co) co = _co;
  if (_noise > noise) noise = _noise;
  if (_dust > dust) dust = _dust;
  if (_uv > uv) uv = _uv;

  if (millis() - timestamp > DATA_UPLOAD_DELAY)
  {

    FirebaseJson json;
    json.set("temp", temp);
    json.set("humidity", humidity);
    json.set("co", co);
    json.set("noise", noise);
    json.set("dust", dust);
    json.set("uv", uv);


    String jsonstr = "";
    json.toString(jsonstr, true);
    Serial.println(jsonstr);

    Serial.println("data uploading...");
    if (Firebase.pushJSON(firebaseData, firebasePath, json))
    {
      Firebase.setTimestamp(firebaseData, firebasePath + firebaseData.pushName() + "/timestamp");
      timestamp = millis();
      temp = 0.0;
      humidity = 0.0;
      co = 0.0;
      noise = 0.0;
      dust = 0.0;
      uv = 0.0;

      Serial.println("Data uploaded successfully");
    }
    else
    {
      Serial.println(firebaseData.errorReason());
      Serial.println("Data upload Failed.. tring again");
      delay(100);
    }
  }
  delay(10);
}



float soundLevel(){
  unsigned long st_time = millis();
  float signalMax = 0, signalMin = 1024;
  while(millis() - st_time < NOISE_SAMPLE_TIME){
    int adc = analogRead(VOICE_SENSOR_PIN);
    if (adc < 1024){
      if (adc > signalMax) signalMax = adc;
      else if (adc < signalMin) signalMin = adc;
    }
    delayMicroseconds(10);
  }
  float db = signalMax - signalMin;
  db = map(db,20,900,49.5,90);
  return db;
}

float coLevel(){
  float adc = getAvgAnalog(CO_SENSOR_PIN, 20);
  float sensor_volt = adcToVoltage(adc);
  float ppm = 3.027 * pow(2.718 , (1.0690 * sensor_volt));
  return ppm;
}


float uvLevel(){
  float uv = getAvgAnalog(UV_SENSOR_OUT_PIN, 1);
  float outputVolatage = (1.12 * uv) / 274.0;

  float intensity  = mapfloat(outputVolatage,0.99,2.8,0.0,15.0);
  return intensity;
}


float dustLevel(){
  digitalWrite(DUST_LED_PIN,LOW);
  delayMicroseconds(DUST_SAMPLING_TIME);

  float adc = analogRead(DUST_MEASURE_PIN);
  

  delayMicroseconds(DUST_DELTA_TIME);
  digitalWrite(DUST_LED_PIN,HIGH);
  delayMicroseconds(DUST_SAMPLING_TIME);

  float outputVoltage = (1.12 * adc) / 274.0;
  outputVoltage = mapfloat(outputVoltage,0.0,3.7,0,5);

  float dustDensity = 0.17 * outputVoltage - 0.1;

  if (dustDensity < 0) dustDensity = 0;

  return dustDensity;

}

float getAvgAnalog(int pin, int sampling){
  float s = 0;
  for (int i=0;i<sampling;i++){
    s+=analogRead(pin);
    delay(2);
  }
  return s/sampling;
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


float adcToVoltage(int adc){
  return (1.12 * adc) / 274.0;
}