function shape(canvas,copy,cobj){
    //��shape������ԣ��˴�thisָ����shape
    this.canvas=canvas;//��������canvas��ӵ�shape��canvas��
    this.copy=copy;
    this.cobj=cobj;//���������Ķ�������cobj��ӵ�shape��canvas��
    this.width=this.canvas.width;//�������Ŀ��浽shape��cobj����
    this.height=this.canvas.height;//�������ĸ߱��浽shape��cobj����
    this.type="line";//����Ĭ������Ϊ���ߣ�
    this.style="stroke";//���ã�Ĭ��Ϊ����
    this.borders="#000";//����Ĭ�ϱߵı���ɫΪ��ɫ��
    this.fill="#000";//����Ĭ�����ı���ɫΪ��ɫ
    this.linew=1;//����Ĭ���ߵĿ��Ϊ1����
    this.historys=[];//Ϊ�˱����ѻ����ͼ�ζ����������飬��������ֿ�������Ľ����趨
    this.bianNum=5;//����Ĭ�ϵĶ���εı���Ϊ�����
    this.jiaoNum=5;
    this.isback=true;
    this.xpsize=10;
    this.isxp=true;
}
shape.prototype={//��shape���ԭ�ͺ���
    init:function(){//init��ʼ����������һ��Ĭ��ֵ�������������
        this.cobj.lineWidth=this.linew;
        this.cobj.strokeStyle=this.borders;
        this.cobj.fillStyle=this.fill;
    },
    draw:function(){//���ĺ������ڻ�ͼ��ʱ��ֱ�ӵ��þͺ�
        var that=this;//��this���������that���棬thisָ���������ʵ��������
        this.copy.onmousedown=function(e){
            //��ʼ����λ��
              e.preventDefault();
           var startx= e.offsetX;
            var starty= e.offsetY;
          
            that.copy.onmousemove=function(e){
                e.preventDefault();
                that.isback=true;
                that.init();//��ʼ��ͼ���ó�ʼ������
                //��������λ��
                var endx= e.offsetX;
                var endy= e.offsetY;
                //��ջ���
                that.cobj.clearRect(0,0,that.width,that.height);
                //���history�������л���������ͼ���򱻱�������
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);//���������������ȫ�������µ�λ��
                }
                that.cobj.beginPath();//ȷ����һ��������ͼ�Σ���Ҫ���¿�ʼһ��·��
                that[that.type](startx,starty,endx,endy);//������λ��
            }
            that.copy.onmouseup=function(){
                 that.historys.push(that.cobj.getImageData(0,0,that.width,that.height))//��ȡ�����������е�����
                that.copy.onmouseup=null;//���Լ�ҲҪ��գ���������صĲ���
                that.copy.onmousemove=null;//���̧���ֹͣ����
            }   
               
        }
    },
    line:function(x,y,x1,y1){//����
        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
    },
    rect:function(x,y,x1,y1){//������
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj[that.style]();
    },
    arc:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/this.bianNum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo((x+r*Math.cos(angle*i)),(y+r*Math.sin(angle*i)));
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/(this.jiaoNum*2)*Math.PI/180;
        var r1=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r2=r1/3;
        for(var i=0;i<this.jiaoNum*2;i++){
            if(i%2==0){
                this.cobj.lineTo((x+r1*Math.cos(angle*i)),(y+r1*Math.sin(angle*i)));
            }else{
                this.cobj.lineTo((x+r2*Math.cos(angle*i)),(y+r2*Math.sin(angle*i)));
            }

        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
     pen:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();

            }

            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }
    },
        eraser:function(xcObj){
        var that=this;
        that.copy.onmousemove=function(e){
            if(that.isxp){
                return false;
            }
            var ox= e.offsetX;
            var oy= e.offsetY;
            var lefts=ox-that.xpsize/2
            var heights=oy-that.xpsize/2
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.width-that.xpsize){
                lefts=that.width-that.xpsize;
            }


            if(heights<0){
                heights=0;
            }
            if(heights>that.height-that.xpsize){
                heights=that.height-that.xpsize;
            }
            xcObj.css({
                display:"block",
                left:lefts+"px",
                top:heights+"px",
            });
        }
        that.copy.onmousedown=function(e){
            var dx= e.clientX;
            var dy= e.clientY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-that.xpsize/2
                var heights=oy-that.xpsize/2
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-that.xpsize){
                    lefts=that.width-that.xpsize;
                }


                if(heights<0){
                    heights=0;
                }
                if(heights>that.height-that.xpsize){
                    heights=that.height-that.xpsize;
                }
                xcObj.css({
                    display:"block",
                    left:lefts+"px",
                    top:heights+"px",
                });
                that.cobj.clearRect(ox,oy,that.xpsize,that.xpsize);
            }
            that.copy.onmouseup=function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.eraser(xcObj);
            }
        }
        that.copy.onmouseout=function(){
            xcObj.css("display","none");
        }
    },
    fanxiang:function(data,x,y){
    for(var i=0;i<data.width*data.height;i++){
        data.data[i*4+0]=255-data.data[i*4+0];
        data.data[i*4+1]=255-data.data[i*4+1];
        data.data[i*4+2]=255-data.data[i*4+2];
        data.data[i*4+3]=255;
    }
    this.cobj.putImageData(data,x,y);
    },
    masaike:function(dataobj,num,x,y){
    var widths=dataobj.width;
    var heights=dataobj.height;
    var w=widths/num;
    var h=heights/num;
    for(var i=0;i<num;i++){
        for(var j=0;j<num;j++){
            var r=0;
            var g=0;
            var b=0;
            var data=this.cobj.getImageData(j*w,i*h,w,h);
            for(var k=0;k<data.width*data.height;k++){
                r+=data.data[k*4+0];
                g+=data.data[k*4+1];
                b+=data.data[k*4+2];
            }
            var r1=parseInt(r/(data.width*data.height));
            var g1=parseInt(g/(data.width*data.height));
            var b1=parseInt(b/(data.width*data.height));
            for(var m=0;m<data.width*data.height;m++){
                data.data[m*4+0]=r1;
                data.data[m*4+1]=g1;
                data.data[m*4+2]=b1;
            }
            this.cobj.putImageData(data,x+j*w,y+i*h)
        }
    }
    },
    gaosimoh:function(dataobj,num,x,y){
    var arr=[];
    var widths=dataobj.width;
    var heights=dataobj.height;
    var num = num;
    for(var i=0;i< widths;i++){
        for(var j=0;j<heights;j++){
          
            var x1=j+num>widths?j-num:j;
            var y1=i+num>heights?i-num:i;
            var dataObj=this.cobj.getImageData(x1,y1,num,num);
            var r=0;var g=0;var b=0;
            for(var k=0;k<dataObj.width*dataObj.height;k++){
                r+=dataObj.data[k*4+0];
                g+=dataObj.data[k*4+1];
                b+=dataObj.data[k*4+2];
            }
            r=parseInt(r/(dataObj.width*dataObj.height));
            g=parseInt(g/(dataObj.width*dataObj.height));
            b=parseInt(b/(dataObj.width*dataObj.height));
            arr.push(r,g,b,255);
        }
    }
    for(var i=0;i<dataobj.data.length;i++){
        dataobj.data[i]=arr[i];
    }
    this.cobj.putImageData(dataobj,x,y);

}

}