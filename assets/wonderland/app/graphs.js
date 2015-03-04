angular.module('WonderlandApp')
  .directive('pageGraph', ['StoryPages', function (StoryPages) {
    return {
      template: '<div class="range-widget">' +
      '<input type="range" ng-bind="distance" />' +
      '</div>',

      scope: {story: '='},

      link: function ($scope, el, attr) {

        var width = 960,
          height = 500;

        var color = d3.scale.category20();
        var force;

        $scope.distance = 20;
        $scope.strength = 10;

        function _loadGraph(id) {

          var svg = d3.select(el[0]).append("svg")
            .attr("width", width)
            .attr("height", height);

          force = d3.layout.force()
            .linkDistance($scope.distance)
            .linkStrength($scope.strength)
            .size([width, height]);

          d3.json("/storypages/graph_for_story/" + id, function (error, graph) {
            var nodes = graph.nodes.slice(),
              links = [],
              bilinks = [];

            graph.links.forEach(function (link) {
              var s = nodes[link.source],
                t = nodes[link.target],
                i = {}; // intermediate node
              nodes.push(i);
              links.push({source: s, target: i}, {source: i, target: t});
              bilinks.push([s, i, t]);
            });

            force
              .nodes(nodes)
              .links(links)
              .start();

            var link = svg.selectAll(".link")
              .data(bilinks)
              .enter().append("path")
              .attr("class", "link");

            var node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("circle")
              .attr("class", "node")
              .attr("r", 15)
              .style("fill", function (d) {
                return color(d.group);
              })
              .call(force.drag);

            node.append("title")
              .text(function (d) {
                return d.name;
              });

            force.on("tick", function () {
              link.attr("d", function (d) {
                return "M" + d[0].x + "," + d[0].y
                  + "S" + d[1].x + "," + d[1].y
                  + " " + d[2].x + "," + d[2].y;
              });
              node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
              });
            });
          });
        }

        $scope.$watch('distance', function (d) {
          force.linkDistance = d;
        });

        $scope.$watch('strength', function (d) {
          force.strength = d;
        });

        $scope.$watch('story', function (id) {
          if (id) {
            _loadGraph(id);
          }
        });

      },
      restrict: 'E'
    }
  }]);
