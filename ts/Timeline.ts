
class TimelineBase {
    
    protected option: any ;
    protected  mainElement : HTMLDivElement ;
    protected allElements : HTMLElement[][] = [];
    protected colorPack : string[] = ["#008080","#43e1b0","#f8b30f","#f09204","#ed5e80","#b13450","#830a3a","#842cbc","#510a7d","#58a9ff","#095db8","#fc7272","#5c0000",];
    protected dotLocations:number[]=[0];
    public constructor( option : any ){
        this.option=option;
        // Create new Element
        this.mainElement = document.createElement("div");
        this.mainElement.classList.add("Timeline_MainElement");
        this.mainElement.setAttribute("style",`width: ${option.width}px `);

        // this.mainElement.style.height=`${(option.data.length*option.offset)}px`;
        for (let i = 0; i < option.data.length; i++) {
            this.createElement(option.data[i],i,option.offset);
            if (i==option.data.length-1) {
                this.dotLocations.push((i+2)*option.offset);
            }
        }
        
        this.mainElement.style.height=`${((option.data.length+1)*(option.offset) )}px`;
        
        
        // ? all Settings
        if ("background" in option ) {
            this.setBackground(option.background);
        }

        // Append to main Element
        this.getRootElement()?.appendChild(this.mainElement);
    }


    protected createElement(el : string[], index : number, offset : number){
        //  check right or left ########### right = true ######### left = false
        var width : number = Number (this.mainElement.style.width.replace("px","")); 
        var elYear : HTMLDivElement = document.createElement("div");
        elYear.innerText= el[0] ;

        var elTitle : HTMLDivElement = document.createElement("div");
        elTitle.innerText = el[1];

        var elContent : HTMLDivElement = document.createElement("div");
        elContent.innerText = el[2];


        var dot : HTMLSpanElement = document.createElement("span");
        this.dotLocations.push(((index+1)*offset));

        this.allElements.push([ elYear,elTitle ,elContent , dot]);

        this.mainElement.appendChild(elYear);
        this.mainElement.appendChild(elTitle);
        this.mainElement.appendChild(elContent);
        this.mainElement.appendChild(dot);
        

    }

  
    protected getRootElement() : Element | null {
        return document.getElementById(this.option.targetId);
    }
    protected setBackground(color:string){
        this.mainElement.style.backgroundColor=color;
    }
}

class Timeline extends TimelineBase{
    private width:number;
    private offset:number;
    constructor(option : any){
        super(option);
        
        this.width = option.width;
        this.offset=option.offset;

        switch (this.option.timeline) {
            case "classic":
                this.mode_Classic(this.width,this.offset);
                break;
            case "inline":
                this.mode_Inline(this.width,this.offset);
                break;
            case "inline_circle":
                this.mode_Inline_Circle(this.width,this.offset);
                break;
            case "inline_classic":
                this.mode_Inline_Classic(this.width,this.offset);
                break;
            case "arrow":
                this.mode_Arrow(this.width,this.offset,false);
                break;
            case "arrow_reverse":
                this.mode_Arrow(this.width,this.offset,true);
                break;
            case "line_arc":
                this.mode_Line_Arc(this.width,this.offset);
                break;
            case "arc":
                this.mode_Arc(this.width,this.offset,false);
                break;
            case "arc_dot":
                this.mode_Arc(this.width,this.offset,true);
                break;
        
            default:
                this.mode_Classic(this.width,this.offset);
                break;
        }
        
    }
    private mode_Arc(width:number,offset:number,withDot : boolean){
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_arc";
            this.allElements[i][0].style.width=`${100}px`;
            this.allElements[i][0].style.top=`${((i)*offset+offset/2)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_arc" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i)*offset + offset/5 ) }px`;
            this.allElements[i][1].style.color=this.colorPack[i];

            this.allElements[i][2].className ="Timeline_Content_arc" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i)*offset+offset/2)}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_arc";
            this.allElements[i][3].style.backgroundColor=`${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i)*offset)}px`;
            if (withDot) {
                if (i!=0) {
                    this.allElements[i][3].style.backgroundColor=`#fff `;
                    this.allElements[i][3].style.border=` 4px solid ${this.colorPack[i]} `;
                    this.allElements[i][3].style.width=` 4px `;
                    this.allElements[i][3].style.height=` 4px`;
                }
                
            }

            if (!test) {
                this.allElements[i][0].style.left= `65%`;

                this.allElements[i][1].style.right= `60%`;
                this.allElements[i][1].style.textAlign="right";

                this.allElements[i][2].style.right= `60%`;
                
                this.allElements[i][2].style.textAlign="right";
            }else{
                this.allElements[i][0].style.right= "65%" ;

                this.allElements[i][1].style.left= "60%" ;
                this.allElements[i][1].style.textAlign="left";

                this.allElements[i][2].style.left= "60%" ;
                this.allElements[i][2].style.textAlign="left";
            }
        }

        var dotEnd : HTMLSpanElement = document.createElement("span");
        dotEnd.className = "Timeline_Dot_arc";
        dotEnd.style.backgroundColor=this.colorPack[this.dotLocations.length-3];
        dotEnd.style.top=`${this.dotLocations[this.dotLocations.length-2]}px`;

        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length-1; i++) {
            var test=this.leftOrRight(i);
            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;
            if (!test) {
                path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]} a ${offset/2} ${offset/2} 0 1 0 0  ${offset}  `);
            }else{
                path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]} a ${offset/2} ${offset/2} 0 0 1 0  ${offset}  `);
            }
           
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","4");
            path.setAttribute("stroke-linecap","round");
            path.setAttribute("fill","none");
            svg.appendChild(path);
        }
        
        this.mainElement.appendChild(dotEnd);
        this.mainElement.appendChild(svg);
    }
    private mode_Line_Arc(width:number,offset:number){
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_line_arc";
            this.allElements[i][0].style.width=`${100}px`;
            this.allElements[i][0].style.top=`${((i)*offset+offset/2-offset/10)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_line_arc" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i)*offset + offset/2)+offset/10 }px`;
            this.allElements[i][1].style.color=this.colorPack[i];

            this.allElements[i][2].className ="Timeline_Content_line_arc" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i)*offset+offset/2+offset/10)}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_line_arc";
            this.allElements[i][3].style.border=` 5px solid ${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i)*offset+offset/2)}px`;

            if (!test) {
                this.allElements[i][0].style.left= `60%`;

                this.allElements[i][1].style.left= `60%`;

                this.allElements[i][2].style.left= `60%`;
            }else{
                this.allElements[i][0].style.right= "60%" ;

                this.allElements[i][1].style.right= "60%" ;
                this.allElements[i][1].style.textAlign="right";
                this.allElements[i][1].style.marginRight="10px";

                this.allElements[i][2].style.right= "60%" ;
                this.allElements[i][2].style.textAlign="right";
                this.allElements[i][2].style.marginRight="10px";
            }
        }
        var dot : HTMLSpanElement = document.createElement("span");
        dot.className = "Timeline_Dot_classic";
        dot.style.backgroundColor=this.colorPack[0];
        dot.style.top=`${0}px`;

        this.mainElement.appendChild(dot);
        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        //  svg.className="Timeline_SVG";
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length; i++) {
            var test : boolean = this.leftOrRight(i);

            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;

            var dotEndLine : HTMLSpanElement = document.createElement("span");
            
            dotEndLine.className = "Timeline_Dot_classic";
            dotEndLine.style.backgroundColor=this.colorPack[i-1];
            dotEndLine.style.top=`${this.dotLocations[i]-offset/2}px`;
            
            if (i!=this.dotLocations.length-1) {
                if (!test) {
                dotEndLine.style.left=`${20}px`;
                }else{
                    dotEndLine.style.left=`${width-20}px`;
                }
            }
            if (i!=1 && i!= this.dotLocations.length) {
                var dotStartLine : HTMLSpanElement = document.createElement("span");
                dotStartLine.className = "Timeline_Dot_classic";
                dotStartLine.style.backgroundColor=this.colorPack[i-1];
                dotStartLine.style.top=`${this.dotLocations[i-1]-offset/2}px`;

                if (!test) {
                    dotStartLine.style.left=`${width/2-20}px`;
                }else{
                    dotStartLine.style.left=`${width/2+20}px`;
                }
                this.mainElement.appendChild(dotStartLine);
            }
            
            if (i==1) {
                path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]} l 0 ${offset/2-20}  a 20 20 0 0 1 20 20 l ${width/2-40} 0  `);
            }else if (i==this.dotLocations.length-1) {
                if (!test) {
                    path.setAttribute("d",`M${width/2-20} ${this.dotLocations[i-1]-offset/2} a 20 20 1 0 0 20 20 l 0 ${offset-20}  `);
          
               }else{
                   path.setAttribute("d",`M${width/2+20} ${this.dotLocations[i-1]-offset/2} a 20 20 0 0 1 -20 20 l 0 ${offset-20}`);
               }
                
            } else {
                if (!test) {
                     path.setAttribute("d",`M${width/2-20} ${this.dotLocations[i-1]-offset/2} a 20 20 1 0 0 20 20 l 0 ${offset-40} a 20 20 1 0 0 -20 20 l -${width/2-40} 0 `);
           
                }else{
                    path.setAttribute("d",`M${width/2+20} ${this.dotLocations[i-1]-offset/2} a 20 20 0 0 1 -20 20 l 0 ${offset-40} a 20 20 0 0 1 20 20 l ${width/2-40} 0 `);
                }
            }
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","4");
            path.setAttribute("stroke-linecap","round");
            path.setAttribute("fill","none");

            this.mainElement.appendChild(dotEndLine);
            svg.appendChild(path);
        }
        this.mainElement.appendChild(svg);

    }
    private mode_Arrow(width:number, offset : number,reverse:boolean){
        this.mainElement.style.height=`${((this.option.data.length)*(offset) )}px`;
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_inline_classic";
            this.allElements[i][0].style.width=`${100}px`;
            this.allElements[i][0].style.top=`${((i)*offset+offset/2)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_inline_classic" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i)*offset)+10 }px`;
            this.allElements[i][1].style.color=this.colorPack[i];

            this.allElements[i][2].className ="Timeline_Content_inline_classic" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i)*offset+offset/2)}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_inline_classic";
            this.allElements[i][3].style.border=` 5px solid ${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i)*offset+offset/2)}px`;

            if (!test) {
                this.allElements[i][0].style.right= `60%`;

                this.allElements[i][1].style.left= `60%`;

                this.allElements[i][2].style.left= `60%`;
            }else{
                this.allElements[i][0].style.left= "60%" ;

                this.allElements[i][1].style.right= "60%" ;
                this.allElements[i][1].style.textAlign="right";
                this.allElements[i][1].style.marginRight="10px";

                this.allElements[i][2].style.right= "60%" ;
                this.allElements[i][2].style.textAlign="right";
                this.allElements[i][2].style.marginRight="10px";
            }
        }
        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length-1; i++) {
            var test : boolean = this.leftOrRight(i);

            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;
            if (reverse) {
                path.setAttribute("d",`M${width/2-20} ${this.dotLocations[i-1]+10+15} l 20 -15 l 20 15 l 0 ${offset-20} l -20 -15 l -20 15 l 0 -${offset-20} `);
           
            }else{
                 path.setAttribute("d",`M${width/2-20} ${this.dotLocations[i-1]+10} l 20 15 l 20 -15 l 0 ${offset-20} l -20 15 l -20 -15 l 0 -${offset-20} `);
           
            }
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","6");
            path.setAttribute("stroke-linecap","round");
            path.setAttribute("fill",this.colorPack[i-1]);
            var path2: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;

            var path3: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
           

            if (!test) {
                path2.setAttribute("d",`M${width/2} ${(i-1)*offset+offset/2} l${width/10} ${0} `);
                path3.setAttribute("d",`M${width/2+width/10+12} ${(i-1)*offset+offset/2-25} q -25 25 0 50 `);

            }else{
                path2.setAttribute("d",`M${width/2} ${(i-1)*offset+offset/2} l${-width/10} ${0} `);
                path3.setAttribute("d",`M${width/2-width/10-12} ${(i-1)*offset+offset/2-25} q 25 25 0 50 `);
            }
            path2.setAttribute( "stroke", this.colorPack[i-1] );
            path2.setAttribute("stroke-width","3");
            path2.setAttribute("stroke-linecap","round");

            path3.setAttribute( "stroke", this.colorPack[i-1] );
            path3.setAttribute("stroke-width","3");
            path3.setAttribute("fill","none");


            svg.appendChild(path);
            svg.appendChild(path2);
            svg.appendChild(path3);


        }
        
        this.mainElement.appendChild(svg);
    }
    private mode_Inline_Classic(width:number, offset : number){
        this.mainElement.style.height=`${((this.option.data.length)*(offset) )}px`;
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_inline_classic";
            this.allElements[i][0].style.width=`${100}px`;
            this.allElements[i][0].style.top=`${((i)*offset+offset/2)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_inline_classic" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i)*offset)+10 }px`;
            this.allElements[i][1].style.color=this.colorPack[i];

            this.allElements[i][2].className ="Timeline_Content_inline_classic" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i)*offset+offset/2)}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_inline_classic";
            this.allElements[i][3].style.border=` 5px solid ${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i)*offset+offset/2)}px`;

            if (!test) {
                this.allElements[i][0].style.right= `60%`;

                this.allElements[i][1].style.left= `60%`;

                this.allElements[i][2].style.left= `60%`;
            }else{
                this.allElements[i][0].style.left= "60%" ;

                this.allElements[i][1].style.right= "60%" ;
                this.allElements[i][1].style.textAlign="right";
                this.allElements[i][1].style.marginRight="10px";

                this.allElements[i][2].style.right= "60%" ;
                this.allElements[i][2].style.textAlign="right";
                this.allElements[i][2].style.marginRight="10px";
            }
        }
        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length-1; i++) {
            var test : boolean = this.leftOrRight(i);

            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;
            path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]+5} L${width/2} ${this.dotLocations[i]-5} `);
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","6");
            path.setAttribute("stroke-linecap","round");

            var path2: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;

            var path3: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
           

            if (!test) {
                path2.setAttribute("d",`M${width/2} ${(i-1)*offset+offset/2} l${width/10} ${0} `);
                path3.setAttribute("d",`M${width/2+width/10+12} ${(i-1)*offset+offset/2-25} q -25 25 0 50 `);

            }else{
                path2.setAttribute("d",`M${width/2} ${(i-1)*offset+offset/2} l${-width/10} ${0} `);
                path3.setAttribute("d",`M${width/2-width/10-12} ${(i-1)*offset+offset/2-25} q 25 25 0 50 `);
            }
            path2.setAttribute( "stroke", this.colorPack[i-1] );
            path2.setAttribute("stroke-width","3");
            path2.setAttribute("stroke-linecap","round");

            path3.setAttribute( "stroke", this.colorPack[i-1] );
            path3.setAttribute("stroke-width","3");
            path3.setAttribute("fill","none");


            svg.appendChild(path);
            svg.appendChild(path2);
            svg.appendChild(path3);


        }
        
        this.mainElement.appendChild(svg);
    }
    private mode_Inline_Circle(width:number , offset:number){
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_inline_circle";
            this.allElements[i][0].style.top=`${(((i+1)*offset)-(offset/2)+39)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";
            this.allElements[i][0].style.border=`4px solid ${this.colorPack[i]} `;

            this.allElements[i][1].className ="Timeline_Title_inline_circle" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i+1)*offset-offset/2)}px`;
            this.allElements[i][1].style.color=this.colorPack[i];

            this.allElements[i][2].className ="Timeline_Content_inline_circle" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i+1)*offset-offset/2)}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_inline_circle";
            this.allElements[i][3].style.border=` 5px solid ${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i+1)*offset-offset/2+39)}px`;

            if (!test) {
                this.allElements[i][0].style.right= `60%`;

                this.allElements[i][1].style.left= `60%`;

                this.allElements[i][2].style.left= `60%`;
            }else{
                this.allElements[i][0].style.left= "60%" ;

                this.allElements[i][1].style.right= "60%" ;
                this.allElements[i][1].style.textAlign="right";
                this.allElements[i][1].style.marginRight="10px";

                this.allElements[i][2].style.right= "60%" ;
                this.allElements[i][2].style.textAlign="right";
                this.allElements[i][2].style.marginRight="10px";

            }
        }

        
        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length-1; i++) {
            var test : boolean = this.leftOrRight(i);
            
            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var path2: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            
            var width:number = this.option.width;
            var testWidth : number = width;
            if (!test) {
                testWidth = -testWidth;
            }

            path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]+offset/4} L${width/2} ${this.dotLocations[i]+offset/4} `);
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","10");
            path.setAttribute("stroke-linecap","round");

            path2.setAttribute("d",`M${width/2}  ${((i)*offset-offset/2+39)} L${width/2-testWidth/10} ${((i)*offset-offset/2+39)}  `);
            path2.setAttribute( "stroke", this.colorPack[i-1] );
            path2.setAttribute("stroke-width","4");

            svg.appendChild(path);
            svg.appendChild(path2);
        }
        
        this.mainElement.appendChild(svg);
        
    }
    private mode_Inline(width:number,offset:number){
        this.mainElement.style.height=`${((this.option.data.length)*(offset) )}px`;
        for (let i = 0; i < this.allElements.length; i++) {
            this.allElements[i][0].className="Timeline_Year_inline";
            this.allElements[i][0].style.width=`${(width/2)-20}px`;
            this.allElements[i][0].style.top=`${((i)*offset)}px`;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_inline" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i)*offset)}px`;
            this.allElements[i][1].style.color=this.colorPack[i];
            this.allElements[i][1].style.left= `55%`;

            this.allElements[i][2].className ="Timeline_Content_inline" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i)*offset)}px`;
            this.allElements[i][2].style.left= `55%`;
            
            this.allElements[i][3].className = "Timeline_Dot_inline";
            this.allElements[i][3].style.border=` 5px solid ${this.colorPack[i]} `;
            this.allElements[i][3].style.top=`${((i)*offset)-2}px`;

        }

        var dotEnd : HTMLSpanElement = document.createElement("span");
        dotEnd.className = "Timeline_Dot_inline";
        dotEnd.style.backgroundColor=this.colorPack[this.dotLocations.length-3];
        dotEnd.style.top=`${this.dotLocations[this.dotLocations.length-2]-5}px`;
        dotEnd.style.border=` 5px solid ${this.colorPack[this.dotLocations.length-3]} `;

        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length-1; i++) {
            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;
            path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]+5} L${width/2} ${this.dotLocations[i]-10} `);
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","6");
            path.setAttribute("stroke-linecap","round");
            svg.appendChild(path);
        }
        
        this.mainElement.appendChild(dotEnd);
        this.mainElement.appendChild(svg);

    }
    private mode_Classic(width:number,offset:number){
        // ! Classic Mode
        for (let i = 0; i < this.allElements.length; i++) {
            var test : boolean = this.leftOrRight(i);

            this.allElements[i][0].className="Timeline_Year_classic";
            this.allElements[i][0].style.width=`${(width/2)-20}px`;
            this.allElements[i][0].style.top=`${((i+1)*offset)}px`;
            this.allElements[i][0].style.transform="translateY(-100%)";
            this.allElements[i][0].style.borderBottom= `5px solid ${this.colorPack[i]} `;
            this.allElements[i][0].style.color=this.colorPack[i];
            this.allElements[i][0].style.fontSize="28px";

            this.allElements[i][1].className ="Timeline_Title_classic" ;
            this.allElements[i][1].style.width=`${(width/2)-20}px`;
            this.allElements[i][1].style.top=`${((i+1)*offset)}px`;
            this.allElements[i][1].style.color=this.colorPack[i];
            
            this.allElements[i][2].className ="Timeline_Content_classic" ;
            this.allElements[i][2].style.width=`${(width/2)-20}px`;
            this.allElements[i][2].style.top=`${((i+1)*offset)+20}px`;
            
            this.allElements[i][3].className = "Timeline_Dot_classic";
            this.allElements[i][3].style.backgroundColor=this.colorPack[i];
            this.allElements[i][3].style.top=`${((i+1)*offset)-2}px`;
            

            if (!test) {
                this.allElements[i][0].style.left= `50%`;

                this.allElements[i][1].style.left= `50%`;

                this.allElements[i][2].style.left= `50%`;
            }else{
                this.allElements[i][0].style.left= "20px" ;

                this.allElements[i][1].style.left= "0px" ;
                this.allElements[i][1].style.textAlign="right";
                this.allElements[i][1].style.marginRight="10px";

                this.allElements[i][2].style.left= "0px" ;
                this.allElements[i][2].style.textAlign="right";
                this.allElements[i][2].style.marginRight="10px";

            }
        }

        var dot : HTMLSpanElement = document.createElement("span");
        dot.className = "Timeline_Dot_classic";
        dot.style.backgroundColor=this.colorPack[0];
        dot.style.top=`${0}px`;

        var dotEnd : HTMLSpanElement = document.createElement("span");
        dotEnd.className = "Timeline_Dot_classic";
        dotEnd.style.backgroundColor=this.colorPack[this.dotLocations.length-1];
        dotEnd.style.top=`${this.dotLocations[this.dotLocations.length-1]}px`;


        var svg: SVGSVGElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","svg");
        //  svg.className="Timeline_SVG";
        svg.setAttribute("width",`${this.option.width}`) ;
        svg.setAttribute("height",`${this.dotLocations[this.dotLocations.length-1]}`) ;

        for (let i = 1; i < this.dotLocations.length; i++) {
            var test : boolean = this.leftOrRight(i);
            var path: SVGPathElement | HTMLElement = document.createElementNS("http://www.w3.org/2000/svg","path");
            var width:number = this.option.width;

            var dotEndLine : HTMLSpanElement = document.createElement("span");
            if (i!=this.dotLocations.length-1) {
               
                dotEndLine.className = "Timeline_Dot_classic";
                dotEndLine.style.backgroundColor=this.colorPack[i-1];
                dotEndLine.style.top=`${this.dotLocations[i]-2}px`;
                if (!test) {
                    dotEndLine.style.left=`${20}px`;
                }else{
                    dotEndLine.style.left=`${width-20}px`;
                }
                
            }
            

            path.setAttribute("d",`M${width/2} ${this.dotLocations[i-1]} L${width/2} ${this.dotLocations[i]} `);
            path.setAttribute( "stroke", this.colorPack[i-1] );
            path.setAttribute("stroke-width","4");
            path.setAttribute("stroke-linecap","round");
            path.setAttribute("stroke-dasharray","10,5,10");

            this.mainElement.appendChild(dotEndLine);
            svg.appendChild(path);
        }

        this.mainElement.appendChild(dot);
        this.mainElement.appendChild(dotEnd);
        this.mainElement.appendChild(svg);

    }
    protected leftOrRight(i:number) : boolean{
        var check : boolean;
        if ((i % 2) == 0) {
            check = false;
        } else {
            check = true;
        };
        return check;
    }
}