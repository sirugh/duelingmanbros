// =======================================
// Create the AirConsole instance
// =======================================
const airconsole = new AirConsole({
  orientation: AirConsole.ORIENTATION_LANDSCAPE
});

let notes;
const $staff = $('#staff')
const $submit = $('#submit')
const $overlay = $('#overlay')

airconsole.onMessage = function(device_id, data) {
  // A mapping of action-to-behaviors.
  const actions = {
    RESET_SONG: function (data) {
      $submit.show()
      $overlay.text('Select the notes.')
      // Re-create the submission array at the specific length incase people forget to add a value.
      notes = Array.apply(null, Array(data.numNotes)).map(() => {})

      // Generate the new staff top-down, left-right.
      $staff.empty()
      for (let i = 5; i >= 0; i--) {
        let $row = $(`<tr id="row_${i}"></tr>`)
        for (let j = 0; j < data.numNotes; j++) {
          // id == row#-column#
          let id = `${i}-${j}`
          let $button = $(
            `<div class="note-selector">
                <input id="${id}" type="checkbox" value="${id}" data-col="${j}"/>
                <label class="note-label" for="button${id}"></label>
              </div>`)

          $button.on('click', function () {
            // Uncheck all other buttons in the column
            const column = $(this).find('input').data('col')
            $(`table input[data-col="${column}"]`).prop('checked', false)

            // Check or uncheck the button.
            const checked = $(this).find('input').prop('checked')
            $(this).find('input').prop('checked', !checked)
          })

          let $td = $('<td></td>')

          $td.append($button)
          $row.append($td)
        }

        $staff.append($row)
        showInput()
      }

      // Check the first note for the player. Cause we be nice.
      $staff.find(`input[id="${data.startingNote}-0"]`).prop('checked', true)
      // TODO: this should work outside the sim.
      // navigator.vibrate(1000);
    },
    WAITING_FOR_PLAYERS: function (data) {
      $overlay.text('Waiting for another player.')
      hideInput()
    },
    GAME_STARTING: function (data) {
      $overlay.text('Get Ready!')
      // Hide the overlay
      hideInput()
      // Display the staff
    },
    END_GAME: function (data) {
      hideInput()
      $overlay.text('Game over! Thanks for playing!')
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
  $submit.hide()

  $overlay.text('Please wait...')

  Array.from($('input:checked')).forEach(input => {
    const row = input.value[0]
    const column = input.value[2]
    notes[column] = row
  })

  // Send the AirConsole Screen that we PRESSED the left button
  airconsole.message(AirConsole.SCREEN, {
    action: 'SUBMIT',
    notes: notes
  });
});


function hideInput () {
  $staff.hide()
  $submit.hide()
}

function showInput () {
  $staff.show()
  $submit.show()
}
