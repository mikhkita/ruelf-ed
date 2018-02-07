ymaps.ready(['AddressDelivery']).then(function init() {
    jQuery.ajax({
        url: '/ajax/tariffZone.php',
        dataType: 'json',
        data: {
            "action": "getZones"
        },
        success: onPolygonLoad
    });
    function onPolygonLoad(json) {
        if($("#map-address").length <= 0){
            return true;
        }
        var defaultCoords = [56.479876, 84.973062];
        var mapNew = new ymaps.Map("map-address", {
                center: defaultCoords,
                zoom: 11,
                controls: ["zoomControl"]
            }, {}),
            cityPolygon,
            searchDeliveryControl = new ymaps.control.SearchControl({
                options: {
                    useMapBounds: true,
                    noCentering: true,
                    noPopup: true,
                    noPlacemark: true,
                    placeholderContent: 'Адрес доставки',
                    size: 'large',
                    float: 'none',
                    position: {right: 10, top: 10}
                }
            }),
            addressClass = new ymaps.AddressDelivery(mapNew);

        mapNew.behaviors.disable('scrollZoom');

        $("body").on("keyup", "#js-order-adress-map-input-floor",
            $.proxy(addressClass.__setFlat, addressClass, $("#js-order-adress-map-input-floor").get(0)));

        $("body").on("click", "#js-map-address-apply",
            $.proxy(addressClass.__applyAddress, addressClass)
        );

        $(".js-order-adress-map-input").blur(function(){
            if(!!$(this).val()){
                ymaps.geocode("город Томск, " + $(this).val(), {
                    results: 1
                }).then(function (res) {
                    addressClass.setPoint(res.geoObjects.get(0).geometry.getCoordinates());
                });
            }
        });

        ymaps.geocode(json.city, {
            results: 1,

        }).then(function (res) {
            mapNew.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
        });

        $('.js-order-adress-map-input').autocomplete({
            source: function(req, autocompleteRes){
                ymaps.geocode("город Томск, " + req.term, {
                    results: 10,
                    boundedBy : [56.231866, 84.579932][56.666401, 85.270441],
                    strictBounds : true,
                }).then(function (res) {
                    var result = [];
                    res.geoObjects.each(function(item){
                        var address = item.properties._data.metaDataProperty.GeocoderMetaData.Address.Components;
                        var label = getAddressLine(address);
                        var value = label;
                        var coords = item.geometry.getCoordinates();
                        result.push({
                            label: label,
                            value: value,
                            coords: coords,
                            balloonContent: item.properties.get("balloonContent")
                        });
                    })
                    autocompleteRes(result);
                });
            },
            select: function(e, selected){
                addressClass.setPoint(selected.item.coords);
            }
        });

        mapNew.events.add('changed-price', function(e){
            $('.js-order-adress-map-form-label').show();
            console.log(e.get('label'));
            if(e.get('label') > 0){
                $('.js-order-adress-map-price').addClass("icon-ruble");
            }else{
                $('.js-order-adress-map-price').removeClass("icon-ruble");
            }
            $('.js-order-adress-map-price').html( e.get('label') );
            $('.b-price-delivery .default').addClass("hide");
            $('.b-price-delivery .price-text').removeClass("hide");
            $('.ui-widget.b-input').addClass("not-empty");
        });
        mapNew.events.add('adress-changed', function(e){
            $('.js-order-adress-map-input').val( e.get('geocode').getAddressLine() )
        });
        // Добавляем контрол в верхний правый угол,
        /*mapNew.controls
            .add(searchDeliveryControl);

        searchDeliveryControl.events
            .add('resultselect', function (e) {
                var results = searchDeliveryControl.getResultsArray(),
                    selected = e.get('index'),
                    point = results[selected].geometry.getCoordinates(),
                    balloonContent = results[selected].properties.get("balloonContent");

                addressClass.setPoint(point, balloonContent);
            })
            .add('load', function (event) {
                // По полю skip определяем, что это не дозагрузка данных.
                // По getResultsCount определяем, что есть хотя бы 1 результат.
                if (!event.get('skip') && searchDeliveryControl.getResultsCount()) {
                    searchDeliveryControl.showResult(0);
                }
            });*/

        var colors = ["#FFFF00","#00FF00"],
            _i = 0;
        console.log(json);
        if ("polygons" in json) {
            for (var polygonBlock in json.polygons) {
                
                var _block = json.polygons[polygonBlock];
                var path = _block["path"],
                    polygonObject,
                    coordinates = [];
                if (path.length < 1) {
                    continue;
                }
                for (var pathPos = 0; pathPos < path.length; pathPos++) {
                    var pathBlock = path[pathPos],
                        _tempBlock = [];

                    for (var i = 0; i < pathBlock.length; i++) {
                        var _line = pathBlock[i];
                        _tempBlock.push([parseFloat(_line[0]), parseFloat(_line[1])]);
                    }
                    coordinates.push(_tempBlock);
                }

                var color = colors[_i],//ntc.findByName(_block["color"]),
                    itemGeoObject = new ymaps.GeoObject({
                        geometry: {
                            type: 'Polygon',
                            coordinates: coordinates
                        },
                        properties: {
                            // Содержимое балуна.
                            price: _block["price"]
                        }
                    }, {
                        strokeColor: color,
                        strokeOpacity: .8,
                        strokeWeight: 4,
                        fillColor: color,
                        fillOpacity: .2
                    });
                itemGeoObject.events.add('click', addressClass._onClick, addressClass);
                mapNew.geoObjects.add(itemGeoObject);
                _i++;
            }
        }
        mapNew.container.fitToViewport(true);
    }

    function getAddressLine(address) {  
        var res = [];
        var locations = ["locality","district","street","house"];
        locations.forEach(function(_item, _i, _arr) {
            address.forEach(function(item, i, arr) {
                if(item.kind == _item){
                    if(_item == "district" && 
                        (item.name.indexOf("микрорайон") >= 0 || item.name.indexOf("район") >= 0)){
                        return;
                    }
                    res.push(item.name);
                }
            });
        });
        res = res.join(', ');
        return res;
    }
});