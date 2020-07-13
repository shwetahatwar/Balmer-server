

exports.getSerailNumbers = (req, res, next) => {
  var { materialCode,extraComment, batchNumber, totalPack, grossWeight, tareWeight } = req.body;
  var materialinward = [];
  var serialNumberId;
  
  if (!req.materialInward) {
    serialNumberId = materialCode + "#" + batchNumber + "#" + "000000";
  }
  else {
    serialNumberId = req.materialInward["serialNumber"];
  }

  for (var i = 0; i < totalPack; i++) {
    serialNumberId = serialNumberId.substring(serialNumberId.length - 6, serialNumberId.length);
    serialNumberId = (parseInt(serialNumberId) + 1).toString();
    var str = '' + serialNumberId;
    while (str.length < 6) {
      str = '0' + str;
    }
    serialNumberId = req.body.materialCode + "#" + req.body.batchNumber + "#" + str;

    materialinward[i] = {
      materialId: req.materail["id"],
      materialCode: materialCode,
      batchNumber: batchNumber,
      serialNumber: serialNumberId,
      isScrapped: false,
      isInward:true,
      dispatchSlipId:null,
      status:true,
      grossWeight:grossWeight,
      tareWeight:tareWeight,
      extraComment:extraComment,
      createdBy:req.user.username,
      updatedBy:req.user.username
    };
  }

  req.materialInwardList = materialinward;
  next();
}
