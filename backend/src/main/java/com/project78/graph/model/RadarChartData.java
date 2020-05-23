package com.project78.graph.model;

import java.util.ArrayList;
import java.util.Map;

public class RadarChartData {

    private ArrayList<String> labels;
    private ArrayList<Map<String,Object>> data = new ArrayList<>();

    public RadarChartData() {}

    public ArrayList<String> getLabels() {
        return labels;
    }

    public void setLabels(ArrayList<String> labels) {
        this.labels = labels;
    }

    public ArrayList<Map<String, Object>> getData() {
        return data;
    }

    public void setData(ArrayList<Map<String, Object>> data) {
        this.data = data;
    }
}
