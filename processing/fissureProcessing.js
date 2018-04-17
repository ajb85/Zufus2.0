const FissureMission = require("../classes/fissureClass.js");

module.exports = function(data) {
  var fissureMish = [];
  data.forEach(function(fissure) {
    var codedFissure = new FissureMission(
      fissure.MissionType,
      fissure.Modifier,
      fissure.Node,
      fissure.Expiry.$date.$numberLong
    );
    fissureMish.push(codedFissure);
  });
  return fissureMish;
};
