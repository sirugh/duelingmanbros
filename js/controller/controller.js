// =======================================
// Create the AirConsole instance
// =======================================
const airconsole = new AirConsole({
  orientation: AirConsole.ORIENTATION_LANDSCAPE
});

const role_info_ele = $('#role_info')
const btn_left_ele = $('#btn_left');
const btn_right_ele = $('#btn_right');

airconsole.onReady = function() {};

airconsole.onMessage = function(device_id, data) {
  if (data.action === 'SET_ROLE') {
    role_info_ele.html(`Welcome to the game ${data.role}.`);
  }
};

// =======================================
// Bind touch events
// =======================================

// Decide if we are on a touch device or using the mouse (e.g. in the AirConsole simulator)
var event_down = isMobile() ? 'touchstart' : 'mousedown';
var event_up = isMobile() ? 'touchend' : 'mouseup';


btn_left_ele.on(event_down, function() {
  // Send the AirConsole Screen that we PRESSED the left button
  airconsole.message(AirConsole.SCREEN, {
    action: 'left', //data.action
    pressed: true
  });
});

btn_left_ele.on(event_up, function() {
  // Send the AirConsole Screen that we RELEASED the left button
  airconsole.message(AirConsole.SCREEN, {
    action: 'left',
    pressed: false
  });
});

btn_right_ele.on(event_down, function() {
  airconsole.message(AirConsole.SCREEN, {
    action: 'right',
    pressed: true
  });
});

btn_right_ele.on(event_up, function() {
  airconsole.message(AirConsole.SCREEN, {
    action: 'right',
    pressed: false
  });
});
