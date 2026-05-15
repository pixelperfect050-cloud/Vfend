package com.mock.location;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MapActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(), "Android");

        String html = "<!DOCTYPE html><html><head>" +
                "<link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'/>" +
                "<script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>" +
                "<style>" +
                "  #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }" +
                "  #search { position: absolute; top: 10px; left: 50px; z-index: 1000; background: white; padding: 5px; border-radius: 5px; border: 1px solid #ccc; width: 70%; }" +
                "</style>" +
                "</head><body>" +
                "<div id='search'><input type='text' id='query' placeholder='Search location...' style='width: 80%; border: none; outline: none;'><button onclick='search()' style='width: 15%; border: none; background: none; cursor: pointer;'>🔍</button></div>" +
                "<div id='map'></div>" +
                "<script>" +
                "var map = L.map('map').setView([28.6139, 77.2090], 13);" +
                "L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);" +
                "var marker;" +
                "function search() {" +
                "  var q = document.getElementById('query').value;" +
                "  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + q)" +
                "    .then(r => r.json())" +
                "    .then(data => {" +
                "      if (data.length > 0) {" +
                "        var item = data[0];" +
                "        var latlng = [parseFloat(item.lat), parseFloat(item.lon)];" +
                "        map.setView(latlng, 15);" +
                "        if (marker) map.removeLayer(marker);" +
                "        marker = L.marker(latlng).addTo(map);" +
                "        Android.onLocationSelected(latlng[0], latlng[1]);" +
                "      } else { alert('Location not found'); }" +
                "    });" +
                "}" +
                "map.on('click', function(e) {" +
                "  if (marker) map.removeLayer(marker);" +
                "  marker = L.marker(e.latlng).addTo(map);" +
                "  Android.onLocationSelected(e.latlng.lat, e.latlng.lng);" +
                "});" +
                "</script></body></html>";

        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void onLocationSelected(double lat, double lon) {
            Intent intent = new Intent();
            intent.putExtra("lat", lat);
            intent.putExtra("lon", lon);
            setResult(RESULT_OK, intent);
            finish();
        }
    }
}
