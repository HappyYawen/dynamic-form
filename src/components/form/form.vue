<template>
  <div id="myForm">
    <!--已存在的表单-->
    <Form ref="formDynamic" id="formDynamic" label-position="right" :model="formDynamic" :label-width="85">
      <Form-item
        v-for="(item, index) in formDynamic.items"
        :key="item.name"
        :label="item.label"
        :prop="'items.' + index + '.value'"
        :rules="item.rules">
        <Row>
          <Col span="9">
          <!--如果是文本框-->
            <Input v-if="item.type=='input'&&(item.number==1)" type="text" v-model="item.value" placeholder="请输入..." :number="true"></Input>
            <Input v-if="(item.number==0)&&item.type=='input'" type="text" v-model="item.value" placeholder="请输入..."></Input>
          <!--如果是textarea-->
            <Input v-if="item.type=='textarea'" type="textarea" :rows="item.rows" v-model="item.value" placeholder="请输入..."></Input>
          <!--如果是select-->
            <Select v-if="item.type=='select'" v-model="item.value">
              <Option v-for="(optionItem, childIndex) in item.option" :value="optionItem.value" :key="optionItem">{{optionItem.text}}</Option>
            </Select>
          <!--如果是checkbox-->
            <Checkbox-group v-if="item.type=='checkbox'" v-model="item.value">
              <Checkbox v-for="(optionItem, childIndex) in item.option"  :key="optionItem" :label="optionItem.value">
                <span>{{optionItem.text}}</span>
              </Checkbox>
            </Checkbox-group>
          <!--如果是radio-->
            <Radio-group v-if="item.type=='radio'" v-model="item.value">
              <Radio v-for="(optionItem, childIndex) in item.option"  :key="optionItem" :label="optionItem.value">
                <span>{{optionItem.text}}</span>
              </Radio>
            </Radio-group>
          <!--如果是日期-->
            <Date-picker v-if="(item.type=='date')||(item.type=='datetime')" :type="item.type" :format="format[item.type]" :placeholder="format[item.type]"></Date-picker>
          <!--如果是时间-->
            <Time-picker v-if="item.type=='time'" type="time" :format="format[item.type]" :placeholder="format[item.type]"></Time-picker>
          </Col>
          <Col span="4" offset="1">
            <Button type="ghost" @click="handleRemove(index)">删除</Button>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
        <Button type="ghost" @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>
    <!--新增表单规则-->
    <Form id="newForm" ref="newForm" label-position="right" :model="oneField" :label-width="85">
      <Row class="add-form">
        <Col span="4">
          <Form-item label="标签" prop="label" :rules="{required:true,max:20,message: '请输入不超过长度20的文字', trigger: 'blur'}">
            <Input type="text" v-model="oneField.label"></Input>
          </Form-item>
        </Col>
        <Col span="4">
          <Form-item label="字段名称" prop="name" :rules="{required:true,pattern:/^[A-Za-z]+$/,max:20,message: '只能输入长度不超过20的英文字母', trigger: 'blur'}">
            <Input type="text"  v-model="oneField.name" placeholder="非中文"></Input>
          </Form-item>
        </Col>
        <Col span="4">
          <Form-item label="类型" prop="type" :rules="{required:true,message: '不能为空', trigger: 'change'}">
            <Select v-model="oneField.type" placeholder="请选择" @on-change="resetRegexp">
              <Option value="input">文本框</Option>
              <Option value="textarea">文本域</Option>
              <Option value="select">下拉框</Option>
              <Option value="radio">单选框</Option>
              <Option value="checkbox">多选框</Option>
              <Option value="date">日期</Option>
              <Option value="time">时间</Option>
              <Option value="datetime">日期+时间</Option>
            </Select>
          </Form-item>
        </Col>
        <Col span="4" v-show="oneField.type=='textarea'">
          <Form-item label="文本域行数" prop="rows" :rules="{required:true,type:'integer',message: '请输入数字', trigger: 'blur'}">
            <Input-number :min="1" v-model="oneField.rows"></Input-number>
          </Form-item>
        </Col>
        <Col span="4">
          <Form-item label="是否必填" prop="require" :rules="{required:true,message: '不能为空', trigger: 'change'}">
            <Radio-group v-model="oneField.require">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </Radio-group>
          </Form-item>
        </Col>
        <Col span="4" v-show="oneField.type=='input'">
          <Form-item prop="rules" label="验证规则">
            <Select placeholder="请选择" v-model="oneField.rules" @on-change="selectRules">
              <Option value="string">字符串</Option>
              <Option value="number">数字</Option>
              <Option value="integer">整数</Option>
              <Option value="float">浮点数</Option>
              <!--<Option value="boolean">布尔值</Option>-->
              <!--<Option value="date">日期</Option>-->
              <Option value="email">email</Option>
              <Option value="url">url链接</Option>
              <Option value="regexp">正则表达式</Option>
            </Select>
          </Form-item>
        </Col>
        <Col span="2" offset="1">
          <Button type="primary" @click="handleAdd" icon="plus-round">新增</Button>
        </Col>
      </Row>
    </Form>
    <!--如果是多选项的表单，则添加表单。-->
    <Form v-show="isMuli" ref="muDynamic" id="muDynamic" label-position="right" :model="inputDynamic"
      :label-width="85">
      <Form-item v-for="(item, index) in inputDynamic.items"
       :label="'选项'+(index+1)"
       :key="item">
        <Row>
          <Col span="3">
            <Form-item :prop="'items.' + index + 'text'">
              <Input type="text" v-model="item.text" placeholder="名称"></Input>
            </Form-item>
          </Col>
          <Col span="3" offset="1">
            <Form-item :prop="'items.' + index + 'value'">
              <Input type="text" v-model="item.value" placeholder="值"></Input>
            </Form-item>
          </Col>
          <Col span="4" offset="1">
            <Button v-if="index!=0" type="ghost" @click="inputRemove(index)">删除</Button>
            <Button v-if="index==0" type="dashed" @click="inputAdd" icon="plus-round">新增</Button>
          </Col>
        </Row>
      </Form-item>
    </Form>
    <!--如果是文本框，添加验证规则-->
    <Form id="regexpForm" v-show="oneField.rules!=''" :model="oneField" ref="regexpForm" :label-width="85">
      <Form-item v-show="oneField.rules=='string'" label="文本最大长度"
        prop="max" :rules="{type:'integer',message: '不符合规则', trigger: 'blur'}">
        <Row>
          <Col span="3">
            <Input type="text" v-model="oneField.max" number></Input>
          </Col>
        </Row>
      </Form-item>
      <Form-item v-show="oneField.rules=='number'||oneField.rules=='integer'||oneField.rules=='float'" label="取值范围">
        <Row>
          <Col span="3">
            <Form-item prop="min" :rules="{type:''+oneField.rules+'',message: '不符合规则', trigger: 'blur'}">
              <Input type="text" v-model="oneField.min" placeholder="最小值" number></Input>
            </Form-item>
          </Col>
          <Col span="1" style="text-align:center">-</Col>
          <Col span="3">
            <Form-item prop="max" :rules="{type:''+oneField.rules+'',message: '不符合规则', trigger: 'blur'}">
              <Input type="text" v-model="oneField.max" placeholder="最大值" number></Input>
            </Form-item>
          </Col>
        </Row>
      </Form-item>
      <!--<Form-item >-->
      <Row v-show="oneField.rules=='regexp'">
        <Col span="6">
          <Form-item label="正则表达式" prop="pattern" :rules="{type:'regexp',required:true,message: '请输入正则表达式', trigger: 'blur'}">
            <Input type="text" v-model="oneField.pattern"></Input>
          </Form-item>
        </Col>
        <Col span="6">
          <Form-item label="规则提示" prop="patternMess" :rules="{required:true,message:'最多30字', max:30,trigger: 'blur'}">
            <Input type="text" v-model="oneField.patternMess"></Input>
          </Form-item>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  export default {
    name:"myForm",
    data () {
      return {
        isMuli:false,
        isValid:0,
       // numberType:{'integer':"整数","float":"浮点数","number":"数字",'string':'文字'},
        noMuli:["input","textarea","date","datetime","time"],
        validateMess:{
          "email":"请输入正确的邮箱",
          "url":"请输入合法链接",
          "date":"请输入正确的日期",
          "datetime":"请输入正确的日期",
          "time":"请输入正确的时间",
          "float":"请输入正确的浮点数",
          "integer":"请输入整数",
          "number":"请输入数字"
        },
        format:{
          "date":"yyyy-MM-dd",
          "time":"HH:mm:ss",
          "datetime":"yyyy-MM-dd HH:mm:ss"
        },
        oneField:{
            label:"",
            name:"",
            type:"",
          require:"0",
            rules:"",
            min:"",
            max:"",
           rows:3,
          format:"",
          pattern:"",
          patternMess:""
        },
        formDynamic: {
          items: [
            {
              label:"爱好",
              name:"favorite",
              type:"checkbox",
              rules:{required:true,type:"array",message:"必填",min:1,trigger:'change'},
              option:[
                {text:"aaa",value:1},
                {text:"bbb",value:2}
              ],
              value:[]
            }
          ]
        },
        inputDynamic: {
          items: [
            {
              text:"",
              value:""
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          console.log(this.formDynamic);
          if (valid) {
            this.$Message.success('提交成功!');
          }else{
            this.$Message.error('表单验证失败!');
          }
          return false;
        });
      },
      handleValidate (name) {
        return this.$refs[name].validate((valid) => {
          if(valid){
            this.isValid+=1;
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      handleAdd () {
        //先验证新增表单规则是否正确。
        let valid = 1;
        this.$options.methods.handleValidate.bind(this)('newForm');
        if(this.$refs['regexpForm'].$el.style.display=="show"){
          this.$options.methods.handleValidate.bind(this)('regexpForm');
          valid+=1;
        }
        if(this.$refs['muDynamic'].$el.style.display=="show"){
          this.$options.methods.handleValidate.bind(this)('muDynamic');
          valid+=1;
        }
        //console.log(this.$refs['regexpForm'].$el.style.display);
        //如果正确，则添加该表单
        if(this.isValid==valid){
          let field = this.oneField;
          let obj = {label:field.label,name:field.name,type:field.type};//新增一条表单的基本字段
          if(field.type!='input'){
            obj.option = JSON.parse(JSON.stringify(this.inputDynamic.items));//深度拷贝
          }
          let rule2 = {};//一般为两条规则，一个是必填，一个是字段规则，此为第二条
          obj.rules = {};
          if(field.rules!='') {
            if (field.rules == "regexp") {
              // rule2.type="regexp";
              rule2.pattern = new RegExp(field.pattern);//正则表达式不能写type
              rule2.message = field.patternMess||"不符合规则";
            }else{
              rule2.type = field.rules;
            }
          }
          if(field.type=="checkbox"){
              rule2.type="array";
              rule2.min=1;
              rule2.message='至少选择一个';
          }
          if(['date','datetime','time'].indexOf(field.type)>-1){
              rule2.type='date';
          }
          if(field.min!=""){
            rule2.min = field.min;
            if(field.rules!="string"){
              rule2.message = this.validateMess[field.rules]+',数值不能低于'+field.min;
            }else {
              rule2.message = '长度至少' + field.min;
            }
          }
          if(field.max!=""){
            rule2.max = field.max;
            if(field.rules!='string'){
              if(rule2.message){
                rule2.message+=",";
              }else{
                rule2.message+=this.validateMess[field.rules]+',数值';
              }
              rule2.message+="不能高于"+field.max;
            }else{
              rule2.message = '长度不能超过' + field.max;
            }
          }
          if(['input','textarea'].indexOf(field.type)==-1){
            rule2.trigger="change";//多选框等，触发验证是change
          }else{
            rule2.trigger="blur";//文本框等，触发验证是blur
          }
          //一条rule
          if(["integer","float","number"].indexOf(field.rules)>-1){
            obj.number = 1;//是数字类型的话，input框要加number属性
          }else{
            obj.number = 0;
          }
          if(field.require=="1"){
            obj.rules = {required:true,message:"必填"};//添加第一条规则
          }
          if((!rule2.message)&&(this.validateMess[field.rules]||this.validateMess[field.type])){
            rule2.message = this.validateMess[field.rules]||this.validateMess[field.type];
          }
          Object.assign(obj.rules,rule2);
          if(field.format!=""){
              obj.format = field.format;//如果是date,则要保存format
          }
          if(field.type==="textarea"){
              obj.rows=parseInt(field.rows);//如果是文本域，则设置行数
          }
          if(field.type=="checkbox"){
            obj.value=[];//初始化value为空数组
          }else{
            obj.value="";//初始化value为空
          }
          this.formDynamic.items.push(obj);//添加表单
         /*还原表单*/
          this.oneField.rules="";
          this.inputDynamic.items=[{
            value: '',
            text:''
          }];
         // this.$refs['muDynamic'].resetFields();
          this.$refs['regexpForm'].resetFields();
          this.$refs['newForm'].resetFields();
          console.log(obj);
        }
        this.isValid=0;
      },
      handleRemove (index) {
        this.formDynamic.items.splice(index, 1);
      },
      inputRemove (index) {
        this.inputDynamic.items.splice(index, 1);
      },
      inputAdd () {
        this.inputDynamic.items.push({
          value: '',
          text:''
        });
      },
      resetRegexp () {
        if(!this.oneField.type||this.noMuli.indexOf(this.oneField.type)>-1){
          this.isMuli= false;
        }else{
          this.isMuli= true;
        }
        this.oneField.rules="";
        //this.inputDynamic.items.splice(1,this.inputDynamic.items.length-1);
        this.inputDynamic.items=[{
          value: '',
          text:''
        }];
        this.$refs['muDynamic'].resetFields();
      },
      selectRules () {
        this.$refs['regexpForm'].resetFields();
      },
      selectTime () {
         this.oneField.format = this.format[this.oneField.date];
         console.log(this.oneField.format);
      }
    }
  }
</script>
<style lang="scss" scoped>
  #myForm{
    #newForm {
      .add-form {
        width: 100%;
        height: 60px;
      }
    }
  }
</style>
