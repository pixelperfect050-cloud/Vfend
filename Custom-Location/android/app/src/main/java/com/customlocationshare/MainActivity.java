package com.customlocationshare;

import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @JavascriptInterface
    public void shareLocation(String url, String text) {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Share Location");
        shareIntent.putExtra(Intent.EXTRA_TEXT, text + "\n\n" + url);
        
        Intent chooser = Intent.createChooser(shareIntent, "Share location via");
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(chooser);
    }

    @JavascriptInterface
    public void shareToWhatsApp(String url, String text) {
        try {
            Intent whatsappIntent = new Intent(Intent.ACTION_SEND);
            whatsappIntent.setType("text/plain");
            whatsappIntent.setPackage("com.whatsapp");
            whatsappIntent.putExtra(Intent.EXTRA_TEXT, text + "\n\n" + url);
            whatsappIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(whatsappIntent);
        } catch (Exception e) {
            shareLocation(url, text);
        }
    }
}
