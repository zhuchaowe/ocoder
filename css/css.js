var fs = require('fs');
var path = require('path');
var css2json = require('css2json');

module.exports = function(cssFile, outPath) {
   console.log(cssFile);
	var css = fs.readFileSync(path.resolve(cssFile), "utf8");
	var json = css2json(css);

	var fileName = path.basename(cssFile);
	var classInfo = fileName.split(':');
	var className = classInfo[0];
	var superClass = classInfo[1];

	var interface = [];
	var implementation = [];
	var allAutoLayout = [];


	var allKeys = Object.keys(json);

	for (var i = 0; i < allKeys.length; i++) {
		var key = allKeys[i];
		var type = key.split("#")[0];
	    var name = key.split("#")[1];

		interface.push(`@property(nonatomic,strong)${type} *${name};`);
	    implementation.push(`
        _${name} = [[${type} alloc]init];
        [self addSubview:_${name}];`);

		var map = json[key];
		var autoLayout = [];
		var allKeys2 = Object.keys(map);
		for (var j = 0; j < allKeys2.length; j++) {
	      var propertyName = allKeys2[j];
	      var value = map[propertyName];

	      if(propertyName == "top" 
	        || propertyName == "left" || propertyName == "right" || propertyName == "bottom" 
	        || propertyName == "center" || propertyName == "centerX" || propertyName == "centerY"){

	        var sp = value.split(" ");
	        var offset = sp[0];
	        var priority = '';
	        var target = '';
	        for (var a = 1; a < sp.length; a++) {
	        	var s = sp[a];
	        	if(s == 'Low' || s == 'Medium' || s == "High"){
		        	priority = `.priority${s}()`;
		        }else{
		        	target = `.${s}`;
		        }
	        }
	        
	        autoLayout.push(`        make.${propertyName}.equalTo(self${target}).offset(${offset}f)${priority};`);
	      }else if(propertyName == "width" || propertyName == "height"){
	      	autoLayout.push(`        make.${propertyName}.equalTo(@${value}f);`);
	      }else if(propertyName == "text"){
	            if(type == "UIButton"){
	                implementation.push(`        [_${name} setTitle:@${value} forState:UIControlStateNormal];`);
	            }else{
	                implementation.push(`        _${name}.text = @${value};`);
	            }
	      }else if(propertyName == "image"){
	            implementation.push(`        _${name}.image = [UIImage imageNamed:@${value}];`);
	      }else if(propertyName == "font-size"){
	            if(type == "UIButton"){
	                implementation.push(`        _${name}.titleLabel.font = [UIFont systemFontOfSize:${value}f];`);
	            }else{
	                implementation.push(`        _${name}.font = [UIFont systemFontOfSize:${value}f];`);
	            }
	      }else if(propertyName == "color"){
	            if(type == "UIButton"){
	                implementation.push(`        [_${name} setTitleColor:[UIColor colorWithString:@"${value}"] forState:UIControlStateNormal];`);
	            }else{
	                implementation.push(`        _${name}.textColor = [UIColor colorWithString:@"${value}"];`);
	            }
	      }else if(propertyName == "background-image"){
	            implementation.push(`        [_${name} setBackgroundImage:[UIImage imageNamed:@${value}] forState:UIControlStateNormal];`);
	      }else if(propertyName == "background-color"){
				implementation.push(`        _${name}.backgroundColor = [UIColor colorWithString:@"${value}"];`);
	      }else if(propertyName != ''){
	            implementation.push(`        _${name}.${propertyName} = ${value};`);
	      }

		}
		var autoLayoutStr = autoLayout.join('\n');
	    allAutoLayout.push(`
    [_${name} mas_makeConstraints:^(MASConstraintMaker *make) {
${autoLayoutStr}
	    }];`);

	}



	var headerFile = `
#import <UIKit/UIKit.h>
#import <EasyIOS/EasyIOS.h>
@interface ${className} : ${superClass}
@end
	`;

	var mFile = `
#import "${className}.h"
#import <Masonry/Masonry.h>

@interface ${className}()
${interface.join('\n')}
@end
@implementation ${className}

-(instancetype)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    if (self) {
        ${implementation.join('\n')}

        [self loadAutoLayout];
    }
    return self;
}

-(void)loadAutoLayout{
    ${allAutoLayout.join('\n')}
}
@end
	`;

	var outPut = path.resolve(outPath);
	var h = path.resolve(outPath+"/"+className+".h");
	var m = path.resolve(outPath+"/"+className+".m");
	fs.writeFile(h, headerFile, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log(`The ${h} file was saved!`);

		fs.writeFile(m, mFile, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log(`The ${m} file was saved!`);
		    var exec = require('child_process').exec; 
		    exec("open "+ outPut);
		});

	});
}



