function send(eleinfo) {
    var url = "/business/queryResEleByIdserial";
    var param = new Object();
    param.idserial = $("#idserial").val();
    param.xqh = $("#xqh").val();
    dkyw.request.post(url, param, function (data) {
        if (data && data.success) {
            var data1 = data.resultData;
            if ("E001" == $("#factorycode").val() || "E002" == $("#factorycode").val()) {
                $("#roombalance").val(dkywcommon.fenToYuan(dkywcommon.yuanToFen(data1.sydl)));
                console.log('this_is_freaking_ele_data:' + dkywcommon.fenToYuan(dkywcommon.yuanToFen(data1.sydl)));
            } else if ("E003" == $("#factorycode").val()) {
                var syld = data1.sydl;
                var sylds = syld.split("/");
                var room = sylds[0];
                var living = sylds[1];
                $("#roombalance").val("房间：" + parseInt(room) + "，客厅：" + parseInt(living));
                console.log('this_is_freaking_ele_data:' + "房间：" + parseInt(room) + "，客厅：" + parseInt(living));
            }
        } else {
            $("#roombalance").val("");
            mh_dialogShow('mh_warning', queryI18n(data.message), 3, true);
        }
        queryBuildingList(eleinfo);
    });
}

$("#factorycode").val('E001');
$("#xqh").val('03');
var url = "/business/queryEleInfoByIdserial";
var param = new Object();
param.idserial = $("#idserial").val();
param.xqh = $("#xqh").val();
dkyw.request.post(url, param, function (data) {
    if (data && data.success) {
        var resultData = data.resultData;
        if (dkywcommon.isEmpty(resultData.jzwbh)) {
        } else if (dkywcommon.isEmpty(resultData.fjlc)) {
        } else if (dkywcommon.isEmpty(resultData.fjmc)) {

        } else {
            if (resultData.xqh == '01') {
                $("#factorycode").find("option[value='E002']").prop("selected", true);
            } else if (resultData.xqh == '03') {
                $("#factorycode").find("option[value='E001']").prop("selected", true);
            } else if (resultData.xqh == '02') {
                $("#factorycode").find("option[value='E003']").prop("selected", true);
            } else {
                return;
            }

            var factorycode = $("#factorycode").val();
            var eleinfo = new Object();
            eleinfo.buildingid = resultData.loudongid;
            eleinfo.floorid = resultData.fjlc;
            eleinfo.roomid = resultData.roomid; //房间ID
            eleinfo.roomname = resultData.fjmc; //房间名称
            if (resultData.xqh == "02") { //盘锦校区存在房间或者客厅用户自选
                eleinfo.livingid = resultData.livingid;
            }
            if (factorycode != 'E002') {
                $("#floorid").parent().hide();
            }
            //获取该证件号对应的房间余额
            send(eleinfo);
        }
    } else {
        $("#factorycode").val('E002');
        $("#xqh").val('01');
        var url = "/business/queryEleInfoByIdserial";
        var param = new Object();
        param.idserial = $("#idserial").val();
        param.xqh = $("#xqh").val();
        dkyw.request.post(url, param, function (data) {
            if (data && data.success) {
                var resultData = data.resultData;
                if (dkywcommon.isEmpty(resultData.jzwbh)) {

                } else if (dkywcommon.isEmpty(resultData.fjlc)) {

                } else if (dkywcommon.isEmpty(resultData.fjmc)) {

                } else {
                    if (resultData.xqh == '01') {
                        $("#factorycode").find("option[value='E002']").prop("selected", true);
                    } else if (resultData.xqh == '03') {
                        $("#factorycode").find("option[value='E001']").prop("selected", true);
                    } else if (resultData.xqh == '02') {
                        $("#factorycode").find("option[value='E003']").prop("selected", true);
                    } else {
                        return;
                    }

                    var factorycode = $("#factorycode").val();
                    var eleinfo = new Object();
                    eleinfo.buildingid = resultData.loudongid;
                    eleinfo.floorid = resultData.fjlc;
                    eleinfo.roomid = resultData.roomid; //房间ID
                    eleinfo.roomname = resultData.fjmc; //房间名称
                    if (resultData.xqh == "02") { //盘锦校区存在房间或者客厅用户自选
                        eleinfo.livingid = resultData.livingid;
                    }
                    if (factorycode != 'E002') {
                        $("#floorid").parent().hide();
                    }
                    //获取该证件号对应的房间余额
                    send(eleinfo);
                }
            } else {
                $("#factorycode").val('E003');
                $("#xqh").val('02');
                var url = "/business/queryEleInfoByIdserial";
                var param = new Object();
                param.idserial = $("#idserial").val();
                param.xqh = $("#xqh").val();
                dkyw.request.post(url, param, function (data) {
                    if (data && data.success) {
                        var resultData = data.resultData;
                        if (dkywcommon.isEmpty(resultData.jzwbh)) {

                        } else if (dkywcommon.isEmpty(resultData.fjlc)) {

                        } else if (dkywcommon.isEmpty(resultData.fjmc)) {

                        } else {
                            if (resultData.xqh == '01') {
                                $("#factorycode").find("option[value='E002']").prop("selected", true);
                            } else if (resultData.xqh == '03') {
                                $("#factorycode").find("option[value='E001']").prop("selected", true);
                            } else if (resultData.xqh == '02') {
                                $("#factorycode").find("option[value='E003']").prop("selected", true);
                            } else {
                                return;
                            }

                            var factorycode = $("#factorycode").val();
                            var eleinfo = new Object();
                            eleinfo.buildingid = resultData.loudongid;
                            eleinfo.floorid = resultData.fjlc;
                            eleinfo.roomid = resultData.roomid; //房间ID
                            eleinfo.roomname = resultData.fjmc; //房间名称
                            if (resultData.xqh == "02") { //盘锦校区存在房间或者客厅用户自选
                                eleinfo.livingid = resultData.livingid;
                            }
                            if (factorycode != 'E002') {
                                $("#floorid").parent().hide();
                            }
                            //获取该证件号对应的房间余额
                            send(eleinfo);
                        }
                    } else {
                    }
                });
            }
        });
    }
});