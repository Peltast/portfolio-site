define("PaintArea", ['GameObject', 'Point', 'ParticleSystem'], function(GameObject, Point, ParticleSystem) {

    class PaintArea extends GameObject {

        constructor(location, size, cellSize, startColor, endColor, startAlpha = 1, endAlpha = 1, brushKey = "", foreground = false) {
            super(location, size, true, null);

            this.cellSize = parseInt(cellSize);
            this.startColor = startColor;
            this.endColor = endColor;
            this.startAlpha = startAlpha;
            this.endAlpha = endAlpha;
            this.brushKey = brushKey;
            this.foreground = foreground;

            this.paintContainer = new createjs.Container();
            this.partitions = [];
            this.partitionSize;
            this.horizontalPartitions;

            this.initializePaintArea(location, size);
        }

        initializePaintArea(location, size) {
            this.createPartitions(location, size);
            this.createCells(location, size);
        }
        createPartitions(location, size) {

            if (size.X >= size.Y) {
                this.horizontalPartitions = true;
                this.partitionSize = new Point( Math.max(Math.min(this.cellSize * 5, size.X), tileSize ), size.Y); 

                for (let x = 0; x < size.X; x += this.partitionSize.X) {
                    var newPartition = {
                        x: x + location.X,
                        y: location.Y,
                        width: this.partitionSize.X,
                        height: this.partitionSize.Y,
                        cells: []
                    };
                    this.partitions.push(newPartition);
                }
            }
            else {
                this.horizontalPartitions = false;
                this.partitionSize = new Point(size.X, Math.max( Math.min(this.cellSize * 5, size.Y), tileSize) );
                
                for (let y = 0; y < size.Y; y += this.partitionSize.Y) {
                    var newPartition = {
                        x: location.X,
                        y: y + location.Y,
                        width: this.partitionSize.X,
                        height: this.partitionSize.Y,
                        cells: []
                    };
                    this.partitions.push(newPartition);
                }
            }
        }
        createCells(location, size) {
            var partitionIndex = 0;

            for (let y = 0; y < size.Y; y += this.cellSize) {
                for (let x = 0; x < size.X; x += this.cellSize) {

                    if (this.horizontalPartitions) {
                        partitionIndex = Math.floor(x / this.partitionSize.X);
                    }
                    else {
                        partitionIndex = Math.floor(y / this.partitionSize.Y);
                    }

                    var cellWidth = (x + this.cellSize <= size.X) ? this.cellSize : (size.X - x);
                    var cellHeight = (y + this.cellSize <= size.Y) ? this.cellSize : (size.Y - y);

                    var newCell = new createjs.Shape();
                    newCell.graphics.beginFill(this.startColor).drawRect(0, 0, cellWidth, cellHeight);
                    newCell.alpha = this.startAlpha;
                    newCell.x = x + location.X;
                    newCell.y = y + location.Y;

                    this.partitions[partitionIndex].cells.push(newCell);
                    this.paintContainer.addChild(newCell);
                }
            }

            this.paintContainer.cache(location.X, location.Y, size.X, size.Y);
        }
        
        handleInteraction(player) {
            if (!this.hasVision(player))
                return;

            var vision = this.getPaintbrushVision(player);

            for (let i = 0; i < this.partitions.length; i++) {
                if (player.checkCollisionWithRect(this.partitions[i].x + vision[0], this.partitions[i].y + vision[1], this.partitions[i].width + vision[2], this.partitions[i].height + vision[3])) {
                    this.checkCellCollision(this.partitions[i], player);
                }
            }

        }
        checkCellCollision(partition, player) {
            var cellsToRemove = [];

            var vision = this.getPaintbrushVision(player);

            for (let i = 0; i < partition.cells.length; i++) {
                if (player.checkCollisionWithRect(partition.cells[i].x + vision[0], partition.cells[i].y + vision[1], this.cellSize + vision[2], this.cellSize + vision[3]) ) {
                    var hitCell = partition.cells[i];

                    cellsToRemove.push(hitCell);
                    hitCell.graphics.clear().beginFill(this.endColor).drawRect(0, 0, this.cellSize, this.cellSize);
                    hitCell.alpha = this.endAlpha;

                    var paintEffect = new ParticleSystem("PaintAreaEffect");
                    paintEffect.modifyParticleData( { "color": this.startColor } );
                    paintEffect.spawnGrid = new Point(this.cellSize, this.cellSize);
                    paintEffect.effectAreaOrigin.add(new Point(hitCell.x, hitCell.y));
                    currentLevel.addParticleEffect(paintEffect);
                }
            }

            for (let j = 0; j < cellsToRemove.length; j++) {
                partition.cells = partition.cells.filter(e => e !== cellsToRemove[j]);
            }

            if (cellsToRemove.length > 0) {
                console.log("this area is painted");
                this.paintContainer.updateCache();
            }

            if (cellsToRemove.length == 0)
                console.log("This area is clear");
        }
        hasVision(player) {
            if (!this.brushKey)
                return true;
            else if (!player.getSelectedItem())
                return false;
            else
                return (player.getSelectedItem().paintbrush === this.brushKey);
        }
        getPaintbrushVision(player) {
            
            var vision = [0, 0, 0, 0];
            return vision;
        }

    }

    return PaintArea;

});