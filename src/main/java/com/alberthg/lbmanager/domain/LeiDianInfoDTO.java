package com.alberthg.lbmanager.domain;

public class LeiDianInfoDTO {
    private String id;
    private String name;
    private Boolean running;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isRunning() {
        return this.running;
    }

    public Boolean getRunning() {
        return this.running;
    }

    public void setRunning(Boolean running) {
        this.running = running;
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", name='" + getName() + "'" +
            ", running='" + isRunning() + "'" +
            "}";
    }
}
