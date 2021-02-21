// ===== Toggle Button Panel =======================================
// ===== Code by T.P Wang and tedGo

var Buttons;

var g_tooltip = window.CreateTooltip();
var g_down = false;

var btn_down = null;
var cur_btn = null;

ButtonStates = {
	normal: 0,
	hover: 1,
	down: 2
}

function Button(x, y, w, h, img_src, func, tiptext)  {
	this.left = x;
	this.top = y;
	this.w = w;
	this.h = h;
	this.right = x + w;
	this.bottom = y + h;
	this.func = func;
	this.tiptext = tiptext;
	this.state = ButtonStates.normal;
	this.img_normal = img_src && img_src.normal ? gdi.Image(img_src.normal) : null;
	this.img_hover = img_src && img_src.hover ? gdi.Image(img_src.hover) : this.img_normal;
	this.img_down = img_src && img_src.down ? gdi.Image(img_src.down) : this.img_hover;
	this.img = this.img_normal;
	
	this.alterImage = function(img_src) {
		this.img_normal = img_src && img_src.normal ? gdi.Image(img_src.normal) : null;
		this.img_hover = img_src && img_src.hover ? gdi.Image(img_src.hover) : this.img_normal;
		this.img_down = img_src && img_src.down ? gdi.Image(img_src.down) : this.img_hover;
		
		this.changeState(this.state);
	}
	
	this.traceMouse = function (x, y) {
		var b = (this.left < x) && (x < this.right) && (this.top < y) && (y < this.bottom);
		if (b)
			g_down ? this.changeState(ButtonStates.down) : this.changeState(ButtonStates.hover);
		else
			this.changeState(ButtonStates.normal);
		return b;
	}
	
	
	this.changeState = function (newstate) {
		if (newstate != this.state)
			window.RepaintRect(this.left, this.top, this.w, this.h);
		this.state = newstate;
		switch (this.state)
		{
		case ButtonStates.normal:
			this.img = this.img_normal;
			break;
			
		case ButtonStates.hover:
			this.img = this.img_hover;
			break;
			
		case ButtonStates.down:
			this.img = this.img_down;
			break;
			
		default:
			this.img = null;
		}
	}
	
	this.draw = function (gr) {
		this.img && gr.DrawImage(this.img, this.left, this.top, this.w, this.h, 0, 0, this.w, this.h);
	}
	
	this.onClick = function () {
		this.func && this.func(x,y);
	}
	
	this.onMouseIn = function() {
		g_tooltip.Text = this.tiptext;
		g_tooltip.Activate();
	}
	
	this.onMouseOut = function() {
		g_tooltip.Deactivate();
	}
}

function buttonsDraw(gr) {
	for (i in Buttons) {
		Buttons[i].draw(gr);
	}
}

function buttonsTraceMouse(x, y) {
	var btn = null;
	for (i in Buttons) {
		if (Buttons[i].traceMouse(x, y) && !btn)
			btn = Buttons[i];
	}
	
	return btn;
}

function on_mouse_move(x, y) {
	var btn = buttonsTraceMouse(x, y);
	
	if (btn != cur_btn) {
		cur_btn && cur_btn.onMouseOut();
		btn && btn.onMouseIn();
	}
	
	cur_btn = btn;
}

function on_mouse_lbtn_down(x, y) {
	g_down = true;
	btn_down = cur_btn;

	if (cur_btn) {
		cur_btn.changeState(ButtonStates.down);
	}
}

function on_mouse_lbtn_up(x, y) {
	if (cur_btn) {
		cur_btn.changeState(ButtonStates.hover);
		if( btn_down == cur_btn )
			cur_btn.onClick(x, y);
	}
	g_down = false;
}

function on_paint(gr) {
	buttonsDraw(gr);
}

function on_mouse_leave() {
	if (cur_btn) {
		cur_btn.changeState(ButtonStates.normal);
	}
}