
    
    var itemArr = []; //定义空数组 用来存放新增的数据;
    var options_text = {
        title:'标题',
        prompt: '文本框', // 文本框内提示文本，文本框特有
        required: 'required',
        valueDefault: '',
        hidden: true, // false 不显示，等于 false 时 不再考虑 showRelation
        viewRelation: null // 显示条件 为 null 总是显示
    };
    var options_checkbox = {
        title:'复选框标题',
        url: 'aaa.json', // 有 url 的话就通过 ajax 同步 get 回数据到 data 属性，忽略下面配的 data 属性
        data: [
            { text: '选项1', value: ''},
            { text: '选项2', value: ''},
            { text: '其他', value: ''},
            { text: '其他_', value: ''}, // 其他后面含文本框
        ],
        required: 'required',
        prompt: '复选框',
        valueDefault: ['选项1','选项2'],
        hidden: false, // false 不显示，等于 false 时 不再考虑 showRelation
        showRelation: [// 显示条件
            {
                ctlname:'sex1',
                value:'男',
                show: true
            }
        ]
    };
    var options_radio = {
        title:'单选框标题',
        url: '',// 有 url 的话就通过 ajax 同步 get 回数据到 data 属性，忽略下面配的 data 属性
        data: [
            { text: '男', value: ''},
            { text: '女', value: ''},
            { text: '其他', value: ''},
            { text: '其他_', value: ''}, // 其他后面含文本框
        ],
        prompt: '单选框',
        required: 'required',
        valueDefault: '男',
        hidden: false, // false 不显示，等于 false 时 不再考虑 showRelation
        viewRelation: null
    };

    //首先获取本地存储的itemArr数组数据
    var GetlocalStorageItemArr =JSON.parse(localStorage.getItem("itemArr") || "[]");

    //页面加载后的 获取本地数据，并回填到头部选择框
    window.onload = function() {
        var $selectName = $('#selectName')
        for(var i = 0;i<GetlocalStorageItemArr.length;i++) {
            var options = $('<option value = '+ GetlocalStorageItemArr[i].ctlname +'>'+ GetlocalStorageItemArr[i].name + '+'+GetlocalStorageItemArr[i].ctlname+ '</option>');
                $selectName.append(options);
        }



       
    }
    //头部“编辑”按钮
    function toEdit() {
        if($('#selectName').val()) {
            var NeedEditItem = findItem($('#selectName').val());
         //   console.log(NeedEditItem)
            showEdit(NeedEditItem);  
        }
        else {
            $.alert('请先选择要编辑的控件!')
        }
        
    }

    //保存 自定义 控件名称 和 类型
    function saveNewAddData() {
        var formData = DomUtil.serialize(document.getElementById('formInfo'));
        //console.log(formData);
        if($('#name').val() =='' || $('#engname').val() =='') {
            $.alert('请将内容填写完整')
        }
        else {
            var item = {
                name:formData.name,
                engname:formData.engname,
                ctlname:formData.engname + (GetlocalStorageItemArr.length + 1).toString() ,
                type:formData.type,
                showCondition:'all',
                template:'#template_'+formData.type,
                options:'',
                value:'',
                valueEx:'',
            };
            item.options = window['options_' +　item.type];

           
            GetlocalStorageItemArr.push(item);
            itemArr = GetlocalStorageItemArr;
            localStorage.setItem('itemArr',JSON.stringify(GetlocalStorageItemArr));
            //console.log(item.ctlname)
            var NeedEditItem = findItem(item.ctlname);
           // console.log(GetlocalStorageItemArr)
            showEdit(NeedEditItem);      
            }
                  
        }

   
    //显示对应的自定义控件
    function showEdit(NeedEditItem) {
        $('#formInfo').hide();

       // console.log(NeedEditItem)
        var dataInter = NeedEditItem;
        var itemType = NeedEditItem.type;

        switch(itemType) {
            case 'text': 
                        var interText = doT.template($('#template_text').text());
                        $('#formBox').html(interText(dataInter));
                        setFormTypeSelectParam('s_tr_0','TempSelect','TempSelectCtlName','text');
                        break;

            case 'checkbox':
                        var interText = doT.template($('#template_checkbox').text());
                        $('#formBox').html(interText(dataInter));
                        setOptionChecked(NeedEditItem.ctlname);
                        setFormTypeSelectParam('s_tr_0','TempSelect','TempSelectCtlName','checkbox');                        

                        break;
            case 'radio': 
                        var interText = doT.template($('#template_radio').text());
                        $('#formBox').html(interText(dataInter));
                        setOptionChecked(NeedEditItem.ctlname);
                        setFormTypeSelectParam('s_tr_0','TempSelect','TempSelectCtlName','radio');
                        break;
        }
        //满足条件显示根据数值显示对应选项
        var v = $('#TempSelectCondition').attr('data-select');
       
        if(v == "anyOne") {
            $('#TempSelectCondition').val('anyOne');
        }
        else {
            $('#TempSelectCondition').val('all');
        }
        //判断是否有其他选项，若存在就将 添加其它 按钮 隐藏
        var isVisible = $('#other').is(':visible');
        if(isVisible) {
            $('#addOtherBtn').hide();
        }
        else {
            $('#addOtherBtn').show();
        }

    }

    //遍历本地数据，根据ctlname查找对应的item数据，并返回对应的item对像
    function findItem(CName) {
        for(var i=0;i<GetlocalStorageItemArr.length;i++) {
            var itemOne = GetlocalStorageItemArr[i];
            if(itemOne.ctlname == CName) {
                return itemOne;
            }
        }
    }

    

    //表单控件自定义保存数据方法
    function saveNewSetData (ctlname) {
       // console.log(ctlname)
        var NeedFindItem = findItem(ctlname);
       // console.log(NeedFindItem)

        var dataArr = [], checkedArr = [];
        $('.select-options_'+ctlname).each(function(index,value){

            var v = $(this).find('input[type="text"]').val();
          //  console.log(v)
            $(this).find('input[type="text"]').attr('value',v);
            $(this).find('input[type="text"]').parent().find('input[type="checkbox"]').attr('value',v).attr('data-check',v);
            $(this).find('input[type="text"]').parent().find('input[type="radio"]').attr('value',v).attr('data-check',v);
            dataArr.push({'text': v,'value':''});

        })

        var checkboxValue = '';
        $('.ischecked').each(function(index,value) {
            var vv = $(this).find('input[name="hidden"]').is(':checked');
            $(this).find('input[name="hidden"]').attr('value',vv);
        })

        var sArr = [];
        $('#showConditionTable tbody tr').each(function(i,v){
            var arr = [];

            if($(this).attr('class') == 's_tr_show'){
                $(this).find('input[type="text"]').each(function(){

                    var selectKey = $(this).attr('data-item');
                    var selectValue = $(this).val();
                    
                    if(selectValue !=''){
                        var temp = {
                            'selectKey': selectKey,
                            'selectValue' : selectValue,
                        };
                        arr.push(temp)
                    }
                })
            }

            $(this).find('select option:selected').each(function (ti,tv) {

                var selectKey = $(this).parent().attr('name');
                var selectValue = $(this).val();
                
                if(selectValue !=''){
                    var temp = {
                        'selectKey': selectKey,
                        'selectValue' : selectValue,
                    };
                    arr.push(temp)
                }
            }); 
          //  console.log(arr)
           sArr.push(arr);
           
        })  

       var relationArr = [];
       for(var i =0;i<sArr.length;i++) {

          var sArritem = sArr[i];

          if(sArritem != '') {
            var newobj = {};
              for(var j=0;j<sArritem.length;j++) {

                if(sArritem[j].selectKey == 'TempSelectCtlName') {
                    newobj.ctlname = sArritem[j].selectValue;
                    
                }
                if(sArritem[j].selectKey =='TempSelectData') {
                    newobj.value  = sArritem[j].selectValue;
                }
                // if(sArritem[j].selectKey =='show'){
                //     newobj.show  = sArritem[j].selectValue;
                // }
                if(sArritem[j].selectKey =='TempSelect'){
                    newobj.type  = sArritem[j].selectValue;
                }
              }
              relationArr.push(newobj)
          }
          
       }
      
      //  console.log('************')
        $('#relationshow').val(JSON.stringify(relationArr));

        var formTypeSetData = DomUtil.serialize(document.getElementById('auiFormTypeTemp'));
        console.log(formTypeSetData)
        formTypeSetData.checkedDefaultValue = formTypeSetData['valueDefaultChecked_' +　ctlname];
        if(formTypeSetData.hasOwnProperty("ohter")) {
            dataArr.push({'text':'其他','value':''});
        }
        console.log(dataArr)
        formTypeSetData.data = dataArr;
        
        if(formTypeSetData.hidden == '') {
            formTypeSetData.hidden = "false";
        }
        if(formTypeSetData.checkedDefaultValue){
            formTypeSetData.checkedDefaultValue = formTypeSetData.checkedDefaultValue.split(",");

        }
        var hidden = formTypeSetData.hidden;
        //console.log(hidden)
        //手动设置viewRelation字段值
        var viewRelation = [];
        if(formTypeSetData.hidden) {
            viewRelation = null;
        }
        else {
            viewRelation =  relationArr;
        }

        var options = {
            data:dataArr || [],
            title:formTypeSetData.title,
            prompt:NeedFindItem.options.prompt,
            required:formTypeSetData.required=="" ? 'false':formTypeSetData.required,
            valueDefault:formTypeSetData.checkedDefaultValue,
            hidden:hidden,
            viewRelation:JSON.parse(formTypeSetData.relationshow),
        }
      //  console.log(NeedFindItem)
        var item = {
            name:NeedFindItem.name,
            engname:NeedFindItem.engname,
            ctlname:NeedFindItem.ctlname,
            type:NeedFindItem.type,
            template:NeedFindItem.template,
            options:options,
            value:formTypeSetData.value,
            valueEx:formTypeSetData.valueEx,
            showCondition:formTypeSetData.TempSelectCondition,

        };

        var itemAnotherArr = [];
        var GetlocalItem =JSON.parse(localStorage.getItem("itemArr") || "[]");

        for(var i=0;i<GetlocalItem.length;i++) {
            var arr = GetlocalItem[i];
            if(arr.ctlname == ctlname){
                itemAnotherArr.push(item);
            }
            else {
                  itemAnotherArr.push(arr);
            }
        }
        // console.log(item)
        // console.log(987)
        localStorage.setItem('itemArr',JSON.stringify(itemAnotherArr));
        var a =JSON.parse(localStorage.getItem("itemArr") || "[]");
       // $.alert('保存成功')
        window.location.reload();//刷新当前页面更新localstorage的内容否则，内容为旧的localstorage

    }
    //预览
    function toPreview() {
        window.location.href ='view.html';
    }


    //增加选项设置
    function addSelectItem(i,type,ctlname) {
        console.log(i)
        var len = $('.select-options_'+ctlname).parent().children().length -1;
        var addLen = len++;
        var insertData = '';
        if(type=='checkbox'){
            console.log('checkbox')
            insertData = insertData + "<div id=\"selectOptions_"+ addLen +"\"  data-index=\""+ addLen +"\" class=\"select-options_"+ctlname+"\" style=\"display:block;\">";
            insertData = insertData + "     <label class=\"aui-input-addon\" style=\"padding-top:0\">";
            insertData = insertData + "           <input type=\"checkbox\" class=\"aui-input dl\" id=\""+ctlname+"_valueDefaultChecked_"+addLen+"\" name=\"valueDefaultChecked_"+ctlname+"\" data-options=\""+ctlname+"\" value=\"\"  style=\"width:auto;margin-right:5px;float:none;display: inline-block;\" />";
            insertData = insertData + "           <input type=\"text\" class=\"aui-input aui-input-sm\" id=\"\" class=\"select1 dl\"  value=\"\" style=\"float:none;display: inline-block;width:70%\" />";
            insertData = insertData + "           <input type=\"button\" id=\"addBtn\" namne=\"addBtn\" class=\"aui-btn aui-btn-block aui-btn-success p-0\" style=\"width:26px;display:inline\" value=\"+\"  onclick=\"addSelectItem('"+addLen+"',\'checkbox\','"+ctlname+"')\"/>";
            insertData = insertData + "           <input type=\"button\" id=\"removeBtn\" namne=\"removeBtn\" class=\"aui-btn aui-btn-block aui-btn-success p-0\" style=\"width:26px;display:inline;\" value=\"-\" onclick=\"removeSelectItem("+addLen+")\"/>";
            insertData = insertData + "     </label>";
            insertData = insertData + "</div>";
        }
        else {
            console.log('radio')
            insertData = insertData + "<div id=\"selectOptions_"+ addLen +"\"  data-index=\""+ addLen +"\"  class=\"select-options_"+ctlname+"\"  style=\"display:block;\">";
            insertData = insertData + "     <label class=\"aui-input-addon\" style=\"padding-top:0\">";
            insertData = insertData + "           <input type=\"radio\" class=\"aui-input dl\" id=\""+ctlname+"_valueDefaultChecked_"+addLen+"\"  name=\"valueDefaultChecked_"+ctlname+"\" value=\"\"  style=\"width:auto;margin-right:5px;float:none;display: inline-block;\" />";
            insertData = insertData + "           <input type=\"text\" class=\"aui-input aui-input-sm\" id=\"\" class=\"select1 dl\"  value=\"\" style=\"float:none;display: inline-block;width:70%\" />";
            insertData = insertData + "           <input type=\"button\" id=\"addBtn\" namne=\"addBtn\" class=\"aui-btn aui-btn-block aui-btn-success p-0\" style=\"width:26px;display:inline\" value=\"+\"  onclick=\"addSelectItem('"+addLen+"',\'radio\','"+ctlname+"')\"/>";
            insertData = insertData + "           <input type=\"button\" id=\"removeBtn\" namne=\"removeBtn\" class=\"aui-btn aui-btn-block aui-btn-success p-0\" style=\"width:26px;display:inline;\" value=\"-\" onclick=\"removeSelectItem("+addLen+")\"/>";
            insertData = insertData + "     </label>";
            insertData = insertData + "</div>";
        }   
                                


        $('#selectOptions_'+i).after(insertData);
    }

    //添加其它
    function addOtherItem() {
        console.log('258')
        $('#addOtherBtn').hide();
        var innerOther = '';
            innerOther = innerOther + "<div id=\"other\"  class=\"select-options_other\" style=\"display:block;\">";
            innerOther = innerOther + "     <label class=\"aui-input-addon\" style=\"padding-top:0\">其他";
            innerOther = innerOther + "           <input type=\"text\" class=\"aui-input aui-input-sm\" id=\"ohter\" name=\"ohter\" class=\"select1 dl\"  value=\"\" style=\"float:none;display: inline-block;width:70%\" disabled/>";
            innerOther = innerOther + "           <input type=\"button\" id=\"removeBtn\" namne=\"removeBtn\" class=\"aui-btn aui-btn-block aui-btn-success p-0\" style=\"width:26px;display:inline;\" value=\"-\" onclick=\"removeOtherItem()\"/>";
            innerOther = innerOther + "     </label>";
            innerOther = innerOther + "</div>";
            $('.optionsWrap').append(innerOther);

    }
    //删除控件模块
    function removeOneItem() {
        var currentSelectCtrlName = $('#selectName').val(); //获取当前选择的CtrlName
        var itemArr = GetlocalStorageItemArr
        if(currentSelectCtrlName){
            for(var i=0;i<itemArr.length;i++) {
                var itemOne = itemArr[i];
                if(itemOne.ctlname == currentSelectCtrlName) {

                    itemArr.splice(i,1)
                }
            }
            console.log(itemArr)
            localStorage.setItem('itemArr',JSON.stringify(itemArr));
            var a =JSON.parse(localStorage.getItem("itemArr") || "[]");
           // $.alert('保存成功')
            window.location.reload();
            }
        else {
            $.alert('请先选择要删除的控件!')
        }
        
        
    }
    //删除其他
    function removeOtherItem(){
        $('#other').remove();

        //判断是否有其他选项，若存在就将 添加其它 按钮 隐藏
        $('#addOtherBtn').show();
    }
    //删除指定某一条选项设置
    function removeSelectItem(i) {
        $('#selectOptions_'+i).remove();
    }

    //编辑某项控件时，跟据存在本地的数据来判断是否是选中的
    function setOptionChecked (ctlname) {
        var FindItem = findItem(ctlname);
        console.log(FindItem)
            
        var item = FindItem;
        var valueDefault = item.options.valueDefault;
        var data = item.options.data || '';
        var showRelation = item.options.showRelation || {};
       
        for(var j =0;j<data.length;j++) {
            var dataitem = data[j];
            for(var k=0;k<valueDefault.length;k++) {
                var vditem = valueDefault[k];
                if(dataitem.text == vditem) {
                    // console.log(dataitem.text)
                   if(item.type =='radio'){
                        $('input[data-radio='+ctlname+'_'+dataitem.text+']').attr('checked','checked');
                   }
                   else {
                        $('input[data-check='+ctlname+'_'+dataitem.text+']').attr('checked','checked');
                   }
                }
            }
        }
        
    }


    //添加条件
     var addTrNumb = 1;
    function addTrConditionBtn() {
        var showType = '<select class="TempSelect" name="TempSelect"  value="" style="display:inline-block;"><option value="" disabled="" selected>请选择</option><option value="radio">单选框</option><option value="checkbox">复选框</option></select>';
        var ctlnameSelect = '<select class="TempSelectCtlName" name="TempSelectCtlName"  value="" style="display:inline-block;"><option value="" disabled="" selected>请选择</option></select>';
        var dataSelect = '<select class="TempSelectData" name="TempSelectData"  value="" style="display:inline-block;"><option value="" disabled="" selected>请选择</option></select>';
       // var isShowSelect = '<select class="show" name="show"  value="" style="display:inline-block;"><option value="" disabled="" selected>请选择</option><option value="true">显示</option><option value="false">隐藏</option></select>'
        var btn = '<div class="aui-btn aui-btn-block aui-btn-success p-5 dl" onclick="removeTrBtn()" style="width:30px;">x</div>'
       
       
        var nlen = addTrNumb++;
        var insertTrData = '';
        insertTrData = insertTrData + "<tr id=\"s_tr_"+ nlen +"\">";
        insertTrData = insertTrData +       "<td>"+showType+"</td>";
        insertTrData = insertTrData +       "<td>"+ctlnameSelect+"</td>";
        insertTrData = insertTrData +       "<td>"+dataSelect+"</td>";
        // insertTrData = insertTrData +       "<td>"+isShowSelect+"</td>";
        insertTrData = insertTrData +       "<td><div class=\"aui-btn aui-btn-block aui-btn-success p-5 dl\" onclick=\"removeTrBtn(this,"+nlen+")\" style=\"width:30px;\">x</div></td>";
        insertTrData = insertTrData + "</tr>";

        $('#showConditionTbody').append(insertTrData);

       //获取当前控件 的类型
        var getType = $('#formBox .aui-form').attr('data-type');
        //console.log(getType)
        setFormTypeSelectParam('s_tr_'+ nlen,'TempSelect','TempSelectCtlName',getType);
    }

    //删除某一行
    function removeTrBtn(e,i){
       // console.log($(e).parent().parent().remove())
        $(e).parent().parent().remove()
    }

    //设置选择select控件时的数据动联及各项参数
    function setFormTypeSelectParam(trId,id,cid,type){
        var itemLocalStorageArr = JSON.parse(localStorage.getItem('itemArr'));
        if(type == 'text'){
           // console.log(111)
            $('#'+trId).find('.TempSelect').change(function() {
           //     console.log(123)
            //如果选择单选框，则遍历全局数据的type为radio的ctlname
            var selectCurrentType = $(this).val();
            var selectArr=[];
            var $TempSelectCtlName = $('#'+trId).find('.TempSelectCtlName');
           // console.log($TempSelectCtlName)
            $('#'+trId).find('.TempSelectCtlName').find("option:not(:first)").remove();
            //$('.TextTempSelectCtlName option:not(:first)').remove();
            
            for(var i =0;i<itemLocalStorageArr.length;i++) {
                var item = itemLocalStorageArr[i];
                if(item.type == selectCurrentType){
                    var options = $('<option value = '+ item.ctlname + '>'+ item.ctlname+ '</option>');
                    selectArr.push(item.ctlname);
                    if(selectArr.indexOf(item.ctlname) != -1){
                        $TempSelectCtlName.append(options);
                    }                                       
                }
                var getCtlNameValue = $TempSelectCtlName.val(); //获取当前选择的ctlname
                var SelectedCtlNameValue = getCtlNameValue || ''; 

                var selectChildArr=[]; 
                var $TempSelectData = $('#'+trId).find('.TempSelectData');
                if(!SelectedCtlNameValue){
                    $('#'+trId).find('.TempSelectCtlName').change(function() {
                        var selectChildArr=[];
                        $('#'+trId).find('.TempSelectData').find("option:not(:first)").remove();
                        // $('.TextTempSelectData option:not(:first)').remove();
                        for(var j =0;j<itemLocalStorageArr.length;j++) {
                            var item = itemLocalStorageArr[j];
                            if(item.ctlname == $(this).val()) {
                                var itemData = item.options.data;
                                for(var k=0;k<itemData.length;k++) {
                                    var itemOptions = $('<option value = '+ itemData[k].text +'>'+ itemData[k].text+ '</option>');
                                    selectChildArr.push(itemData[k].text);
                                    if(selectChildArr.indexOf(itemData[k].text) != -1){
                                       $TempSelectData.append(itemOptions)
                                    }
                                    
                                }
                            }
                        }
                    })
                }
                else {
                    $('#'+trId).find('.TempSelectData').find("option:not(:first)").remove();
                    //$('#TextTempSelectData option:not(:first)').remove();
                        for(var j =0;j<itemLocalStorageArr.length;j++) {
                            var item = itemLocalStorageArr[j];
                            if(item.ctlname == SelectedCtlNameValue) {
                                var itemData = item.options.data;
                                for(var k=0;k<itemData.length;k++) {
                                    var itemOptions = $('<option value = '+ itemData[k].text +'>'+ itemData[k].text+ '</option>');
                                    selectChildArr.push(itemData[k].text);
                                    if(selectChildArr.indexOf(itemData[k].text) != -1){
                                       $TempSelectData.append(itemOptions)
                                    }
                                    
                                }
                            }
                        }
                    }
                
                }
            })
        }
        else {
            $('#'+trId).find('.TempSelect').change(function() {
                var selectCurrentType = $(this).val(); //获取当前选择的 显示类型[type、checkbox、radio]

                var currentSelectCtrlName = $('#selectName').val(); //获取当前选择的CtrlName
                var selectArr=[];//设置空的数组
                // var $TempSelectCtlName = $('#'+cid);
                var $TempSelectCtlName = $('#'+trId).find('.TempSelectCtlName');
                $('#'+trId).find('.TempSelectCtlName').find("option:not(:first)").remove();
                //$('#CheckboxTempSelectCtlName option:not(:first)').remove();

                for(var i =0;i<itemLocalStorageArr.length;i++) {
                    var item = itemLocalStorageArr[i];

                    if((item.ctlname != currentSelectCtrlName) && (item.type == selectCurrentType)){
                        var options = $('<option value = '+ item.ctlname + '>'+ item.ctlname+ '</option>');
                        selectArr.push(item.ctlname);
                        if(selectArr.indexOf(item.ctlname) != -1){
                            $TempSelectCtlName.append(options);
                        }  
                    }

                    var getCtlNameValue = $TempSelectCtlName.val(); //获取当前选择的ctlname
                    var SelectedCtlNameValue = getCtlNameValue || ''; 

                    var selectChildArr=[]; 
                    var $TempSelectData = $('#'+trId).find('.TempSelectData');
                    if(!SelectedCtlNameValue) {
                        $('#'+trId).find('.TempSelectCtlName').change(function() {
                            $('#'+trId).find('.TempSelectData').find("option:not(:first)").remove();
                            //$('#CheckboxTempSelectData option:not(:first)').remove();
                            for(var j =0;j<itemLocalStorageArr.length;j++) {
                                var item = itemLocalStorageArr[j];
                                if(item.ctlname == $(this).val()) {
                                    var itemData = item.options.data;
                                    for(var k=0;k<itemData.length;k++) {
                                        var itemOptions = $('<option value = '+ itemData[k].text +'>'+ itemData[k].text+ '</option>');
                                        selectChildArr.push(itemData[k].text);
                                        if(selectChildArr.indexOf(itemData[k].text) != -1){
                                           $TempSelectData.append(itemOptions)
                                        }
                                        
                                    }
                                }
                            }
                        })
                    }
                    else{
                        $('#'+trId).find('.TempSelectData').find("option:not(:first)").remove();
                        for(var j =0;j<itemLocalStorageArr.length;j++) {
                            var item = itemLocalStorageArr[j];
                            if(item.ctlname == SelectedCtlNameValue) {
                                var itemData = item.options.data;

                                for(var k=0;k<itemData.length;k++) {
                                    var itemOptions = $('<option value = '+ itemData[k].text +'>'+ itemData[k].text+ '</option>');
                                    selectChildArr.push(itemData[k].text);
                                    if(selectChildArr.indexOf(itemData[k].text) != -1){
                                       $TempSelectData.append(itemOptions)
                                    }
                                    
                                }
                            }
                        }
                    }  
                }
            })
        }
        
    }
