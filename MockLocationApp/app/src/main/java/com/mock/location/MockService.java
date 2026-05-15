package com.mock.location;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;

public class MockService extends Service {

    private static final String TAG = "MockService";
    private LocationManager locationManager;
    private Handler handler = new Handler();
    private double targetLat, targetLon;
    private boolean isMocking = false;

    private Runnable mockRunnable = new Runnable() {
        @Override
        public void run() {
            if (isMocking) {
                setMockLocation(targetLat, targetLon);
                handler.postDelayed(this, 1000); // Update every second
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "START".equals(intent.getAction())) {
            targetLat = intent.getDoubleExtra("lat", 0);
            targetLon = intent.getDoubleExtra("lon", 0);
            startMocking();
        } else if (intent != null && "STOP".equals(intent.getAction())) {
            stopMocking();
        }
        return START_STICKY;
    }

    private void startMocking() {
        try {
            locationManager.addTestProvider(LocationManager.GPS_PROVIDER, 
                false, false, false, false, true, true, true, 
                0, 5);
            locationManager.setTestProviderEnabled(LocationManager.GPS_PROVIDER, true);
            isMocking = true;
            handler.post(mockRunnable);
        } catch (SecurityException e) {
            Log.e(TAG, "Security Exception: Mock location not enabled in Developer Options");
        } catch (Exception e) {
            Log.e(TAG, "Error starting mock: " + e.getMessage());
        }
    }

    private void stopMocking() {
        isMocking = false;
        handler.removeCallbacks(mockRunnable);
        try {
            locationManager.removeTestProvider(LocationManager.GPS_PROVIDER);
        } catch (Exception e) {
            Log.e(TAG, "Error removing test provider: " + e.getMessage());
        }
        stopSelf();
    }

    private void setMockLocation(double lat, double lon) {
        Location mockLocation = new Location(LocationManager.GPS_PROVIDER);
        mockLocation.setLatitude(lat);
        mockLocation.setLongitude(lon);
        mockLocation.setAltitude(3.0);
        mockLocation.setTime(System.currentTimeMillis());
        mockLocation.setAccuracy(1.0f);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }

        try {
            locationManager.setTestProviderLocation(LocationManager.GPS_PROVIDER, mockLocation);
        } catch (Exception e) {
            Log.e(TAG, "Error setting mock location: " + e.getMessage());
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
