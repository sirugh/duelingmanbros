// =======================================
// Create the AirConsole instance
// =======================================
const airconsole = new AirConsole({
  orientation: AirConsole.ORIENTATION_LANDSCAPE
});

const role_info_ele = $('#role_info')


airconsole.onReady = function() {};

airconsole.onMessage = function(device_id, data) {
  // A mapping of action-to-behaviors.
  const actions = {
    RESET_SONG: function (data) {
      $('#song_title').html(`SONG: "${data.song_name}"`)
      navigator.vibrate(1000);
    }
  }

  // Actually call it.
  actions[data.action](data)
};

// =======================================
// Bind touch events
// =======================================

// Decide if we are on a touch device or using the mouse (e.g. in the AirConsole simulator)
const event_down = isMobile() ? 'touchstart' : 'mousedown';
const event_up = isMobile() ? 'touchend' : 'mouseup';

$('#submit').on('click', function() {
  // Send the AirConsole Screen that we PRESSED the left button
  airconsole.message(AirConsole.SCREEN, {
    action: 'submit',
    notes: ['c', 'b', 'g', 'b#']
  });
});

