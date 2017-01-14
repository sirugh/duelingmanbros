const NOTES = ['d', 'f', 'a', 'c', 'e', 'g']

// =======================================
// Create the AirConsole instance
// =======================================
const airconsole = new AirConsole({
  orientation: AirConsole.ORIENTATION_LANDSCAPE
});

// Notes is an array that correlates to the different notes on the staff.
let notes = []
const $staff = $('#staff')
airconsole.onMessage = function(device_id, data) {
  // A mapping of action-to-behaviors.
  const actions = {
    RESET_SONG: function (data) {
      $('#song_title').html(`SONG: "${data.song}"`)
      notes = new Array(data.numNotes)
      notes[0] = data.startingNote

      // Generate the new staff top-down, left-right.
      $staff.empty()
      for (let i = 5; i >= 0; i--) {
        let $row = $(`<tr id="row_${NOTES[i]}"></tr>`)
        for (let j = 0; j <= notes.length; j++) {
          $row.append(
            `<td class="note">
              <button id="${NOTES[i]}-${j}">${NOTES[i]}</button>
            </td>`)
        }
        $staff.append($row)
      }

      // TODO: this should work outside the sim.
      // navigator.vibrate(1000);
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

$('.note').on('click', function () {
  // TODO: Set column based on where this was clicked in the table.
  const column = 0

  // TODO: Set based on actual note value
  notes[column] = 'a'
})

