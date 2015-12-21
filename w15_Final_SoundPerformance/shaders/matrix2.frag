#ifdef GL_ES
precision mediump float;
#endif
                
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(in float x){
    return fract(sin(x)*43758.5453);
}

float random(in vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

mat3 yuv2rgb = mat3(0.0, 0.0, 1.13983, 
                    0.687, -0.01465, -0.58060, 
                    1.0, 2.03211, 0.0);

float rchar(in vec2 outer,in vec2 inner){
    float grid = 5.;
    vec2 margin = vec2(.2,.05);
    float seed = 23.;
    vec2 borders = step(margin,inner)*step(margin,1.-inner);
    return step(.5,random(outer*seed+floor(inner*grid))) * borders.x + borders.y;
}

vec3 matrix(in vec2 st){
    float rows = 30.0;
    // vec2 ipos = floor(st*rows);
    vec2 ipos = fract(st);

    ipos += vec2(.0,floor(u_time*20.*random(ipos.x)));

    
    vec2 fpos = fract(st*rows);
    vec2 center = (.5-fpos);

    float pct = random(ipos);
    // float glow = (1.-dot(center,center)*3.)*2.0;


    return vec3(rchar(ipos,fpos) * pct);
}

void main(){
    vec2 st = gl_FragCoord.st/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;
    vec3 color = vec3(0.0);

    vec2 vel = floor(vec2(u_time*10.)); 
    vel *= vec2(0.,1.); 

    vec2 offset = vec2(0.2,0.);

    color.r *= random(floor(st+vel+offset));
    color.g *= random(floor(st+vel));
    color.b *= random(floor(st+vel-offset));
    color = yuv2rgb * matrix(st);
    gl_FragColor = vec4( 1.-color , 1.0);
}