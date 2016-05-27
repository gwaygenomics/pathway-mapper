;
(function($, $$)
{
    var defaults = {
        height: 30,   //height of the icon container
        width: 30,    //width of the icon container
        padding: 5,  //padding of the icon container(from right & top)
        backgroundColorDiv: '#f8f8f8',   //background color of the icon container
        borderColorDiv: '#CFCFCF',    //border color of the icon container
        borderWidthDiv: '1px',    //border width of the icon container
        borderRadiusDiv: '5px',    //border radius of the icon container

        icon: 'fa fa-square-o',   //icon class name

        nodeParams: function(){
            // return element object to be passed to cy.add() for adding node
            return {};
        }
    };

    $.fn.cytoscapeNodeadd = function(params) {
        var options = $.extend(true, {}, defaults, params);
        var fn = params;

        var functions = {
            destroy: function() {
                var $this = $(this);

                $this.find(".ui-cytoscape-nodeadd").remove();
            },
            init: function()
            {
                return $(this).each(function()
                {
                    var components = options.components;
                    for (var index in components)
                    {
                      var component = components[index];
                      var dragContainer = component.container;
                      var explanationText = component.explanationText;

                      var $nodeadd = $('<div class="ui-cytoscape-nodeadd"></div>');
                      dragContainer.append($nodeadd);

                      var $nodeDragHandle = $('<div class="ui-cytoscape-nodeadd-nodediv"> \
                                                <span id="ui-cytoscape-nodeadd-icon" class="draggable icon ' + options.icon + '">\
                                                <span  class="">'+explanationText+'</span>\
                                                </span>\
                                              </div>');
                      $nodeadd.append($nodeDragHandle);

                      $nodeDragHandle.bind("mousedown", function(e)
                      {
                        e.stopPropagation(); // don't trigger dragging of nodeadd
                        e.preventDefault(); // don't cause text selection
                      });

                      //Setup UI
                      dragContainer.find(".ui-cytoscape-nodeadd-nodediv").css({
                        background: options.backgroundColorDiv,
                        border: options.borderWidthDiv + ' solid ' + options.borderColorDiv,
                        'border-radius': options.borderRadiusDiv
                      });

                      //Init Draggable
                      dragContainer.find("#ui-cytoscape-nodeadd-icon").draggable({
                          helper: "clone",
                          cursor: "pointer"
                      });
                    }

                    var $container = $(this);
                    //Init Droppable
                    $container.droppable({
                        activeClass: "ui-state-highlight",
                        // accept: "#ui-cytoscape-nodeadd-icon",
                        drop: function(event, ui) {
                            $container.removeClass("ui-state-highlight");

                            var currentOffset = $container.offset();
                            var relX = event.pageX - currentOffset.left;
                            var relY = event.pageY - currentOffset.top;

                            var nodeType = $(ui.helper).find('span').text().toUpperCase();

                            var cy = $container.cytoscape("get");
                            cy.add(
                            {
                                group: "nodes",
                                data: {type: nodeType, name:'newNode'},
                                renderedPosition:
                                {
                                    x: relX,
                                    y: relY
                                }
                            });

                        }
                    });

                });
            }
        };

        if (functions[fn]) {
            return functions[fn].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof fn == 'object' || !fn) {
            return functions.init.apply(this, arguments);
        } else {
            $.error("No such function `" + fn + "` for jquery.cytoscapenodeadd");
        }

        return $(this);
    };

    $.fn.cynodeadd = $.fn.cytoscapeNodeadd;

    /* Adding as an extension to the core functionality of cytoscape.js*/
    $$('core', 'nodeadd', function(options) {
        var cy = this;

        $(cy.container()).cytoscapeNodeadd(options);
    });

})(jQuery, cytoscape);