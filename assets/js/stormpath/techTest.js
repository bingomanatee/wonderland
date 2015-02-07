(function () {
  var MAX_PEOPLE = 100;
  var RADIUS = Math.min(window.innerWidth / 2, (window.innerHeight - 30) / 2);
  var IN_SCALE = 0.8;
  var SPEED_OF_REMOVAL = 500;
  var SPEED_OF_HIDING = 500;

  function Person() {
    this.id = Person.nextId;
    ++Person.nextId;
    this.initGraphic();
    this.active = true;
    this.order = this.id;
  }

  Person.nextId = 1;
  var removing = false;
  var PERSON_GRAPHIC_TEMPLATE = '<div class="person" style="left: [radius]px; top: [radius]px" id="person-[id]">[id]</div>';
  Person.prototype = {
    initGraphic: function () {
      var markup = PERSON_GRAPHIC_TEMPLATE.replace(/\[id\]/g, this.id).replace(/\[radius\]/g, RADIUS);
      $('#peopleGraphics').append(markup);
      this.graphic = $('#peopleGraphics').find('#person-' + this.id);

    },

    position: function (duration) {
      if (!this.active) {
        return this.graphics ? this.graphics.hide() : null;
      }
      var angle = this.order * Math.PI * 2 / (people.length);
      var x = Math.cos(angle) * RADIUS * IN_SCALE + RADIUS;
      var y = Math.sin(angle) * RADIUS * IN_SCALE + RADIUS;

      this.graphic.animate({
        left: x,
        top: y
      }, duration);

    },

    setActive: function (active, time) {
      console.log('removing item ' + this.id + ' over ticks: ' + time);
      removing = true;
      this.active = active;
      if (active) {
        this.graphic.show();
      } else {
        this.graphic.animate({
          left: RADIUS,
          top: RADIUS
        }, time, function () {
          this.graphic.hide();
          removing = false;
        }.bind(this));
      }
      orderPeople();
      positionPeople();
    }
  };

  var people = [];
  var removedPeople = [];

  function loadPeople() {

    for (var i = 0; i < MAX_PEOPLE; ++i) {
      people.push(new Person());
    }
  }

  function orderPeople() {
    var activePeople = [];
    for (var i = 0; i < people.length; ++i) {
      if (people[i].active) {
        activePeople.push(people[i]);
      } else {
        removedPeople.push(people[i]);
      }
    }
    people = activePeople;
    for (var j = 0; j < people.length; ++j) people[j].order = j;

  }

  function positionPeople() {
    for (var i = 0; i < people.length; ++i) people[i].position(500);
  }

  function activePeople() {
    var count = 0;
    for (var i = 0; i < people.length; ++i) if (people[i].active) {
      ++count;
    }
    return count;
  }

  var skipNumber = 0;
  var personNumber = 0;

  function addFeedback(msg) {
    return;
    $('#feedback').val($('#feedback').val() + "\n " + msg);
  }

  var removingPerson = false;

  function removePerson() {
    if (removing || removingPerson) {
      return;
    }
    removingPerson = true;
    addFeedback('removing a person; skip at ' + skipNumber);
    if (people.length > 1) {
      var skipped = 0;
      while (skipped < skipNumber) {
        personNumber = (personNumber + 1) % people.length;
        ++skipped;
        addFeedback('(skip ' + skipped + ' of ' + skipNumber + '); at person (id ' + people[personNumber].id + ')');
      }
      addFeedback('removing person id ' + people[personNumber].id);
      people[personNumber].setActive(false, SPEED_OF_HIDING);
      ++skipNumber;
    } else {
      clearInterval(repeater);
      $('#answer').text('the last person is person ' + people[0].id);
    }
    removingPerson = false;
  }

  // main

  loadPeople();
  positionPeople();
  var repeater = 0;
  SPEED_OF_REMOVAL = $('#sor').val();

  function startRemoving() {
    repeater = setInterval(removePerson, SPEED_OF_REMOVAL);
  }

  $('#sor').change(function () {
    SPEED_OF_REMOVAL = $('#sor').val();
    $('#sorFeedback').text(SPEED_OF_REMOVAL);
    if (people.length > 1) {
      clearInterval(repeater);
      startRemoving();
    }
  });

  $('#soh').change(function () {
    SPEED_OF_HIDING = $('#soh').val();
    $('#sohFeedback').text(SPEED_OF_HIDING);
  });

  setTimeout(startRemoving, 200);

})();
