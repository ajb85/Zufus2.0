const SortieMission = require("../classes/sortieClass.js");

module.exports = function(data) {
  var sortieMish = [];
  var bossName = data.Boss;
  var expiration = data.Expiry.$date.$numberLong;
  data.Variants.forEach(function(mission) {
    var codedSortie = new SortieMission(
      bossName,
      mission.missionType,
      mission.modifierType,
      mission.node,
      expiration
    );
    sortieMish.push(codedSortie);
  });
  return sortieMish;
};
