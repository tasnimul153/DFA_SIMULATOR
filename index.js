function node_design() {
    myDiagram.nodeTemplate = S(go.Node, "Auto",
        { selectionAdorned: false },
        {mouseEnter: mouseEnter, mouseLeave: mouseLeave},
        S(go.Shape, "Ellipse", {width: 80, height: 80, stroke: "black", strokeWidth: 2, name: "SHAPE"},
            new go.Binding("fill", "color")
        ),
        S(go.TextBlock, "text", {name: "TEXT", font: "25px sans-Serif"},
            new go.Binding("text", "key")
        )
    );
}

$(document).ready(function() {
    let to = [];
    let from = [];
    let label = [];
    let ac_nodes = [];
    let state_number = 0;
    let ac_state_number = 0;
    let connection_number = 0;
    let nodeDataArray = [];
    let linkDataArray = [];
    let x = 0;
    var S = go.GraphObject.make;
    myDiagram = S(go.Diagram, "mydg");
    myDiagram.model = S(go.GraphLinksModel);

    $("#btn2").click(function() {
        if($("#to_").val() == "" || $("#from_").val() == "" || $("#label_").val() == "") {
            $("#success").html('<i class="fa fa-check-circle" aria-hidden="true"></i> Connection failed!');
            $("i").css("color", "red");
            $("#success").animate({
                top: '20px'
            }, 100);
            $("#success").animate({
                top: '20px'
            }, 800);
            $("#success").animate({
                top: '-60px'
            }, 100);
            $(".input").val("");
        } else {
            $("#success").html('<i class="fa fa-check-circle" aria-hidden="true"></i> Nodes connected');
            $("i").css("color", "lime");
            $("#success").animate({
                top: '20px'
            }, 100);
            $("#success").animate({
                top: '20px'
            }, 800);
            $("#success").animate({
                top: '-60px'
            }, 100);
            to.push($("#to_").val());
            from.push($("#from_").val());
            label.push($("#label_").val());
            linkDataArray.push({to: "S"+to[x], from: "S"+from[x], data: label[x]});
            $("#close").after('<p>S'+from[x]+' ---> S'+to[x]+' (' + label[x] + ') '+'</p>');
            $(".input").val("");
            connection_number++;
            $("#nconnection").text(connection_number);
            x++;
        }
    });

    $("#connInfo").click(function() {
        $("#connInfo").fadeOut();
    });

    $("#btn1").click(function() {
        $("#test_button").fadeIn(1300);
        $("#mainBox").fadeOut(300);
        myDiagram.linkTemplate = S(go.Link, S(go.Shape),
            S(go.Shape, {toArrow: "Standard"}),
            S(go.TextBlock, {font: "bold 25px sans-Serif", stroke: "blue", width: 40, height: 40},
                new go.Binding("text", "data"))
        );
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        myDiagram.nodeTemplate = S(go.Node, "Auto",
            { selectionAdorned: false },
            {mouseEnter: mouseEnter, mouseLeave: mouseLeave},
            S(go.Shape, "Ellipse", {width: 80, height: 80, stroke: "black", strokeWidth: 2, name: "SHAPE"},
                new go.Binding("fill", "color")
            ),
            S(go.TextBlock, "text", {name: "TEXT", font: "25px sans-Serif"},
                new go.Binding("text", "key")
            )
        );
    });

    $("#test_button").click(function() {
        let str_index = 0;
        let len = to.length;
        let currentNode = 0;
        let str = $("#test_str").val();
        let strLength = str.length;
        if(strLength == 0) {
            $("#tresult").text("N/A");
            $("#tresult").css("color", "black");
            $("#tresult").css("background-color", "wheat");
            alert("You have to input a string.");
        } else {
            for(let i = 0; i < len; i++) {
                if(from[i] == currentNode) {
                    if(str[str_index] == label[i]) {
                        currentNode = to[i];
                        i = -1;
                        str_index++;
                        if(str_index >= strLength) {
                            break;
                        }
                    }
                }
                if(i == len-1) {
                    for(let j = 0; j < len; j++) {
                        if(from[j] == currentNode) {
                            if(label[j] == '@') {
                                currentNode = to[j];
                                i = -1;
                                str_index++;
                                break;
                            }
                        }
                    }
                    if(str_index >= strLength) {
                        break;
                    }
                }
            } 
            let found_ac = false;
            for(let i = 0; i < ac_nodes.length; i++) {
                if(currentNode == ac_nodes[i]) {
                    $("#tresult").text("Valid");
                    $("#tresult").css("color", "black");
                    $("#tresult").css("background-color", "lightgreen");
                    found_ac = true;
                }
            }
            if(!found_ac) {
                $("#tresult").text("Invalid");
                $("#tresult").css("color", "black");
                $("#tresult").css("background-color", "rgb(255, 98, 98)");
            }
        }
    });

    $("#submitButton").click(function() {
        state_number = $("#num_of_states").val();
        ac_state_number = $("#num_of_ac_states").val();
        if(state_number > 0) {
            $("#fiid").fadeOut();
            $("#fiid2").fadeIn(1300);
            $("#nstate").text(state_number);
            $("#nacstate").text(ac_state_number);
            for(let i = state_number-1; i >= 0; i--) {
                $("#ac_state_title").after('<input type="checkbox" ' + 'name="S_" class="ch1"  value="' + i + '" id="S'+i+'">S'+i+'<br>');
            }
            var $checkboxes = $("input[name='S_']");
            $checkboxes.change(function() {
                if($checkboxes.filter(':checked').length == ac_state_number) {
                    $("#fiid2").fadeOut();
                    $("#mainBox").animate ({
                        height: "500px"
                    });
                    $("#fiid3").fadeIn(1500);
                    $("#connInfo").fadeIn(1500);
                    $.each($("input[name='S_']:checked"), function() {
                        ac_nodes.push($(this).val());
                    });
                    for(let t = ac_nodes.length-1; t >= 0; t--) {
                        $("#nac").after(
                            '<p>Accepted State ' + (t+1) + ': S'+ac_nodes[t] + '</p>'
                        );
                    }

                    if(jQuery.inArray(""+0, ac_nodes)!=-1) {
                        nodeDataArray.push({key: "S0", color: "rgb(162, 243, 166)"});;
                    } else {
                        nodeDataArray.push({key: "S0", color: "white"});
                    }
                    for(let i = 1; i < state_number; i++) {
                        if(jQuery.inArray(""+i, ac_nodes)!=-1) {
                            nodeDataArray.push({key: "S"+i, color: "rgb(162, 243, 166)"});
                        } else {
                            nodeDataArray.push({key: "S"+i, color: "rgba(0,0,0,0)"});
                        }
                    }
                }
            });
        } else {
            alert("Number of states should be at least 1");
            location.reload();
        }
    });
});

function mouseEnter(e, obj) {
    var shape = obj.findObject("SHAPE");
    shape.stroke = "blue";
    var text = obj.findObject("TEXT");
    text.stroke = "blue";
};

function mouseLeave(e, obj) {
    var shape = obj.findObject("SHAPE");
    shape.stroke = "black";
    var text = obj.findObject("TEXT");
    text.stroke = "black";
};