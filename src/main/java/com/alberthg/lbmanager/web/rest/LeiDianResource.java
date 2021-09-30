package com.alberthg.lbmanager.web.rest;

import com.alberthg.lbmanager.domain.LeiDianInfoDTO;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leidian")
public class LeiDianResource {

  private final Logger log = LoggerFactory.getLogger(LeiDianResource.class);
  private final String ldPath;

  public LeiDianResource(@Value("${ldpath}") String ldPath) {
    this.ldPath = ldPath;
  }

  @GetMapping("/getVmList")
  public ArrayList<LeiDianInfoDTO> getVmList() {
    String s = this.runProcessAndGetReturnString(ldPath + "ldconsole.exe list2");
    log.info("{} ldconsole.exe list2", ldPath);
    ArrayList<LeiDianInfoDTO> result = new ArrayList<>();
    if (s != null) {
      String[] leiDianInfos = s.split("\n");
      for (int i = 0; i < leiDianInfos.length; i++) {
        log.debug("{}", leiDianInfos[i]);
        String[] leiDianInfo = leiDianInfos[i].split(",");
        if (leiDianInfo.length >= 3) {
          LeiDianInfoDTO leiDianInfoDTO = new LeiDianInfoDTO();
          leiDianInfoDTO.setId(leiDianInfo[0]);
          leiDianInfoDTO.setName(leiDianInfo[1]);
          leiDianInfoDTO.setRunning(!leiDianInfo[2].equals("0"));
          result.add(leiDianInfoDTO);
        }
      }
    }
    return result;
  }

  @GetMapping("/launchVmByName/{name}")
  public void launchVmByName(@PathVariable String name) {
    this.runProcess(ldPath + "ldconsole.exe launch --name " + name);
  }

  @GetMapping("/quitVmByName/{name}")
  public void quitVmByName(@PathVariable String name) {
    this.runProcess(ldPath + "ldconsole.exe quit --name " + name);
  }

  @PostMapping("launchVmByName")
  public void launchVmByNameInPatch(HttpServletRequest request, @RequestBody String[] names) throws InterruptedException {
    for (int i = 0; i < names.length; i++) {
      // this.launchVmByName(names[i]);
      this.runProcess(ldPath + "ldconsole.exe launch --name " + names[i]);
      log.debug("ldconsole.exe launch --name {}", names[i]);
      Thread.sleep(100);
    }
  }

  @PostMapping("quitVmByName")
  public void quitVmByNameInPatch(HttpServletRequest request, @RequestBody String[] names) throws InterruptedException {
    for (int i = 0; i < names.length; i++) {
      // this.quitVmByName(names[i]);
      this.runProcess(ldPath + "ldconsole.exe quit --name " + names[i]);
      log.debug("ldconsole.exe quit --name {}", names[i]);
      Thread.sleep(50);
    }
  }

  @GetMapping("/sortWindows/{size}")
  public void sortWindows(@PathVariable Integer size) {
    String configPath = ldPath + "\\vms\\config\\leidians.config";
    try {
      BufferedReader br = new BufferedReader(new FileReader(configPath));
      StringBuilder sb = new StringBuilder();
      String line;
      while ((line = br.readLine()) != null) {
        if (line.contains("\"windowsRowCount\":")) {
          line = line.replaceAll(": .*,", ":  " + size + ",");
        }
        sb.append(line);
        sb.append("\n");
      }
      br.close();
      BufferedWriter writer = new BufferedWriter(new FileWriter(configPath, false));
      writer.append(sb.toString());
      writer.close();
      log.debug(sb.toString());
    } catch (FileNotFoundException e) {
      log.error("{}", e.getMessage());
    } catch (IOException e) {
      log.error("{}", e.getMessage());
    }
    this.runProcess(ldPath + "ldconsole.exe sortWnd");
  }

  private String runProcessAndGetReturnString(String commandStr) {
    String result = null;
    Runtime runtime = Runtime.getRuntime();
    try {
      Process process = runtime.exec(commandStr);
      BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream(), Charset.forName("GBK")));
      BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), Charset.forName("GBK")));
      StringBuilder sb = new StringBuilder();
      String line;
      while ((line = stdoutReader.readLine()) != null) {
        sb.append(line);
        sb.append("\n");
      }
      result = sb.toString();
      while ((line = stderrReader.readLine()) != null) {
        sb.append(line);
        sb.append("\n");
      }
      int exitVal = process.waitFor();
      log.info("process exit value is {}", exitVal);
    } catch (IOException | InterruptedException e) {
      log.error("run commond '{}' and get error {}", commandStr, e.getMessage());
    }
    return result;
  }

  private void runProcess(String commandStr) {
    Runtime runtime = Runtime.getRuntime();
    try {
      Process process = runtime.exec(commandStr);
      int exitVal = process.waitFor();
      log.info("process exit value is {}", exitVal);
    } catch (IOException | InterruptedException e) {
      log.error("run commond '{}' and get error {}", commandStr, e.getMessage());
    }
  }
}
