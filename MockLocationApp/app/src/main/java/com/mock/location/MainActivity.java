package com.mock.location;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText etLat, etLong;
    private Button btnStart, btnStop, btnPickMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etLat = findViewById(R.id.etLat);
        etLong = findViewById(R.id.etLong);
        btnStart = findViewById(R.id.btnStart);
        btnStop = findViewById(R.id.btnStop);
        btnPickMap = findViewById(R.id.btnPickMap);

        btnPickMap.setOnClickListener(v -> {
            Intent intent = new Intent(this, MapActivity.class);
            startActivityForResult(intent, 1001);
        });

        btnStart.setOnClickListener(v -> {
            String lat = etLat.getText().toString();
            String lon = etLong.getText().toString();

            if (lat.isEmpty() || lon.isEmpty()) {
                Toast.makeText(this, "Please enter coordinates", Toast.LENGTH_SHORT).show();
                return;
            }

            Intent intent = new Intent(this, MockService.class);
            intent.putExtra("lat", Double.parseDouble(lat));
            intent.putExtra("lon", Double.parseDouble(lon));
            intent.setAction("START");
            startService(intent);
            Toast.makeText(this, "Mocking Started", Toast.LENGTH_SHORT).show();
        });

        btnStop.setOnClickListener(v -> {
            Intent intent = new Intent(this, MockService.class);
            intent.setAction("STOP");
            stopService(intent);
            Toast.makeText(this, "Mocking Stopped", Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1001 && resultCode == RESULT_OK) {
            double lat = data.getDoubleExtra("lat", 0);
            double lon = data.getDoubleExtra("lon", 0);
            etLat.setText(String.valueOf(lat));
            etLong.setText(String.valueOf(lon));
        }
    }
}
