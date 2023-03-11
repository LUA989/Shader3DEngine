import java.awt.Robot;
import java.awt.AWTException;

PShader renderPoly;
PVector screenResolution, ro, rr;
float time, zoom = 1.0;
int frame;
String renderFile = "renderpoly.frag";
PImage texture, skyTexture, cubemap, unknownTexture;
PrintWriter reports;
Robot robot;

void setup() {
  //size(600, 600, P2D);
  fullScreen(P2D);
  //surface.setResizable(true);
  renderPoly = loadShader(renderFile);
  texture = loadImage("texture.png");
  skyTexture = loadImage("skybox2_reference.jpg");
  cubemap = loadImage("skybox3_cubemap.png");
  unknownTexture = loadImage("a.png");
  ro = new PVector(0, 0, 0);
  rr = new PVector(0, 0, 0);
  renderPoly.set("mat", texture);
  renderPoly.set("sky", skyTexture);
  renderPoly.set("cubemap", cubemap);
  //renderPoly.set("texture", texture);
  reports = createWriter("crashreports/crashreport_" + year() + month() + day() + hour() + minute() + second() + millis() + ".txt");
  try {
    robot = new Robot();
    noCursor();
  } catch (AWTException e) {
    System.err.println("Robot class not supported by your system!");
    exit(); 
  }
  println(QUARTER_PI, HALF_PI, PI, TWO_PI);
  textAlign(LEFT, TOP);
}

void draw() {
  try {
    filter(renderPoly);
    if(keyPressed) {
      if(key == 'w') {
        ro.x += cos(rr.z) * 0.1;
        ro.y += sin(rr.z) * 0.1;
      }
      if(key == 's') {
        ro.x -= cos(rr.z) * 0.1;
        ro.y -= sin(rr.z) * 0.1;
      }
      if(key == 'a') {
        ro.x -= cos(rr.z + HALF_PI) * 0.1;
        ro.y -= sin(rr.z + HALF_PI) * 0.1;
      }
      if(key == 'd') {
        ro.x += cos(rr.z + HALF_PI) * 0.1;
        ro.y += sin(rr.z + HALF_PI) * 0.1;
      }
      if(key == TAB) saveFrame("screenshot-" + year() + month() + day() + ".png");
      if(keyCode == 16) ro.z -= 0.1;
      if(key == ' ') ro.z += 0.1;
      if(keyCode == 18) rr = new PVector(0, 0, 0);
    }
    robot.mouseMove(width / 2, height / 2);
    rr.z -= ((float)width / 2 - mouseX) / 166.66666666;
    rr.z %= TWO_PI;
    rr.y += ((float)height / 2 - mouseY) / 166.66666666;
    if(rr.y > HALF_PI) rr.y = HALF_PI;
    if(rr.y < -HALF_PI) rr.y = -HALF_PI;
    time += 1 / frameRate;
    frame++;
    renderPoly.set("sResolution", new PVector(width, height, 0));
    renderPoly.set("time", time);
    renderPoly.set("frame", frame);
    renderPoly.set("ro", ro);
    renderPoly.set("rr", rr);
    renderPoly.set("zoom", zoom);
    text("3D Engine\nFile: " + renderFile + "\nFPS: " + frameRate + "\nTime: " + time + "\nFrame: " + frame + "\nPosition: " + ro + "\nAngles: " + rr + "\nZoom: " + zoom, 5, 5);
  } catch (Exception e) {
    System.err.println(e);
    reports.print('[' + hour() + ':' + minute() + ':' + second() + "] ");
    reports.println(e);
    reports.flush();
    reports.close();
    exit();      
  }
}

void mouseWheel(MouseEvent event) {
  if(zoom > 0.0) zoom -= event.getCount() / 10.0; else zoom = 0.01;
  println(event.getCount() / 10.0);
}

boolean isDivides(float v, float d) {
  return v % d == 0;
}
